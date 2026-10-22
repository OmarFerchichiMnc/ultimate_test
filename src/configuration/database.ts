import { Client } from "pg";
import { config } from "./config";
import { ensureDbTunnel, isLocalDbHost, resetDbTunnel } from "./ssmTunnel";

function connectionError(error: unknown): Error {
  return new Error(
    `Error fetching DB values (${config.database.user}@${config.database.host}:${config.database.port}/${config.database.database}): ${String(error)}`,
  );
}

function isConnectionRefused(error: unknown): boolean {
  const message = String(error);
  return /ECONNREFUSED|ECONNRESET|ETIMEDOUT|timeout expired/i.test(message);
}

function createClient(): Client {
  return new Client({
    host: config.database.host,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    connectionTimeoutMillis: 8000,
    ssl: { rejectUnauthorized: false },
  });
}

async function connectClient(): Promise<Client> {
  await ensureDbTunnel();
  const client = createClient();
  try {
    await client.connect();
    return client;
  } catch (error) {
    await client.end().catch(() => undefined);
    if (!isLocalDbHost() || !isConnectionRefused(error)) {
      throw connectionError(error);
    }
    resetDbTunnel();
    await ensureDbTunnel();
    const retry = createClient();
    try {
      await retry.connect();
      return retry;
    } catch (retryError) {
      await retry.end().catch(() => undefined);
      throw connectionError(retryError);
    }
  }
}

async function withClient<T>(run: (client: Client) => Promise<T>): Promise<T> {
  if (!config.database.user || !config.database.password) {
    throw new Error("Database credentials are missing. Set DB_USER and DB_PASSWORD in .env");
  }

  const client = await connectClient();
  try {
    return await run(client);
  } finally {
    await client.end().catch(() => undefined);
  }
}

export async function fetchValues(query: string): Promise<string[]> {
  const rows = await fetchRows(query);
  return rows.map((row) => String(Object.values(row)[0] ?? "")).filter(Boolean);
}

export async function fetchRows(query: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
  return withClient(async (client) => {
    const result = await client.query(query, params);
    return result.rows as Record<string, unknown>[];
  });
}

export function firstPopulated(
  rows: Record<string, unknown>[],
  field: string,
): Record<string, unknown> | undefined {
  return rows.find((row) => {
    const value = row[field];
    return value !== null && value !== undefined && String(value).trim() !== "";
  });
}

export function uniqueField(rows: Record<string, unknown>[], field: string, limit = 3): string[] {
  return uniqueMapped(rows, (row) => String(row[field] ?? "").trim(), limit);
}

export function uniqueMapped(
  rows: Record<string, unknown>[],
  map: (row: Record<string, unknown>) => string,
  limit = 3,
): string[] {
  const values: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    const value = map(row).trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    values.push(value);
    if (values.length >= limit) break;
  }
  return values;
}

export function channelTypeLabel(row: Record<string, unknown>): string {
  const channel = String(row.sale_channel_type ?? "").trim();
  const source = String(row.sale_source_name ?? "").trim();
  if (channel && source) return `${channel} - ${source}`;
  return channel;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function monthContaining(value: unknown): string {
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return monthRange(Number(match[1]), Number(match[2]) - 1);
    }
  }
  const date = value instanceof Date ? value : new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid payment date: ${String(value)}`);
  }
  return monthRange(date.getFullYear(), date.getMonth());
}

function monthRange(year: number, monthIndex: number): string {
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);
  const fmt = (day: Date) => `${pad(day.getDate())}/${pad(day.getMonth() + 1)}/${day.getFullYear()}`;
  return `${fmt(start)} - ${fmt(end)}`;
}

const schema = config.database.schema;

export const queries = {
  recentSales: `
    SELECT
      id,
      document_number,
      pnr_reference,
      payment_id,
      approval_code,
      sale_channel_type,
      sale_source_name,
      country,
      operation_id,
      form_of_payment_code,
      alternative_method_of_payment_code AS fop_sub_code,
      settlement_matching_status AS settled_status,
      payment_date,
      cc_bin,
      cc_four_last_digits
    FROM "${schema}".sale
    WHERE payment_date IS NOT NULL
    ORDER BY created_date DESC
    LIMIT 20
  `,
  recentSettlements: `
    SELECT
      id,
      document_number,
      pnr_reference,
      payment_id,
      approval_code,
      country,
      operation_id,
      form_of_payment_code,
      alternative_method_of_payment_code AS fop_sub_code,
      settlement_matching_status AS settled_status,
      payment_date,
      acquirer,
      cc_bin,
      cc_four_last_digits,
      payment_order_reference
    FROM "${schema}".settlement
    WHERE payment_date IS NOT NULL
    ORDER BY created_date DESC
    LIMIT 20
  `,
  recentPaymentOrders: `
    SELECT
      id,
      payment_order_reference,
      payment_order_date AS payment_date,
      acquirer_name AS acquirer,
      bank_deposit_reference,
      operation_id,
      bank_reconciliation_status AS banked_status
    FROM "${schema}".payment_order
    WHERE payment_order_date IS NOT NULL
    ORDER BY created_date DESC
    LIMIT 20
  `,
  recentBankDeposits: `
    SELECT
      id,
      deposit_date AS payment_date,
      acquirer_name AS acquirer,
      bank_deposit_reference,
      bank_account_number,
      transaction_id AS operation_id,
      bank_reconciliation_status AS banked_status
    FROM "${schema}".bank_deposit
    WHERE deposit_date IS NOT NULL
    ORDER BY created_date DESC
    LIMIT 20
  `,
  settlementsByPaymentOrderReference: `
    SELECT
      id,
      pnr_reference,
      document_number,
      settlement_date,
      payment_date,
      acquirer,
      form_of_payment_code,
      settlement_currency,
      gross_in_settlement_currency_amount,
      payment_order_reference
    FROM "${schema}".settlement
    WHERE payment_order_reference = $1
    ORDER BY settlement_date
  `,
};

function utcDay(value: unknown): Date {
  const date = value instanceof Date ? value : new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${String(value)}`);
  }
  return date;
}

export function formatUiDate(value: unknown): string {
  const date = utcDay(value);
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
}

const creationDateTables = ["sale", "settlement", "payment_order", "bank_deposit"] as const;
export type CreationDateTable = (typeof creationDateTables)[number];

export async function shiftCreationDate(table: CreationDateTable, id: string, createdDate: string): Promise<void> {
  if (!creationDateTables.includes(table)) {
    throw new Error(`Unsupported creation-date table: ${table}`);
  }
  await fetchRows(`UPDATE "${schema}"."${table}" SET created_date = $1::timestamptz WHERE id::text = $2`, [
    createdDate,
    id,
  ]);
}

export async function shiftSaleRefundCreatedDates(paymentId: string, daysAgo = 60): Promise<void> {
  const cutoff = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  await fetchRows(
    `UPDATE "${schema}"."sale"
     SET created_date = $1::timestamptz
     WHERE payment_id::text = $2`,
    [cutoff, paymentId],
  );
}

export function dateRangeCovering(values: unknown[]): string {
  const times = values.map((value) => utcDay(value).getTime());
  return `${formatUiDate(new Date(Math.min(...times)))} - ${formatUiDate(new Date(Math.max(...times)))}`;
}

