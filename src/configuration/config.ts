import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import YAML from "yaml";

dotenv.config();

const PROJECT_ROOT = process.cwd();
const yamlPath = path.join(PROJECT_ROOT, "src/configuration/config.yaml");
const yamlConfig = YAML.parse(fs.readFileSync(yamlPath, "utf8")) as Record<string, any>;

function env(name: string, fallback = ""): string {
  const value = process.env[name];
  return value !== undefined && value !== "" ? value : fallback;
}

function envBool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes"].includes(value.toLowerCase());
}

const molecule = yamlConfig.test_files.sale_settlement_molecule.correct;

export const config = {
  projectRoot: PROJECT_ROOT,
  app: {
    baseUrl: env("ADAD_BASE_URL", yamlConfig.app.base_url),
    headless: envBool("ADAD_HEADLESS", Boolean(yamlConfig.app.headless)),
    slowMoMs: Number(env("ADAD_SLOW_MO_MS", String(yamlConfig.app.slow_mo_ms ?? 0))),
    navigationTimeoutMs: Number(
      env("ADAD_NAVIGATION_TIMEOUT_MS", String(yamlConfig.app.navigation_timeout_ms ?? 30000)),
    ),
  },
  auth: {
    url: env("AUTH_URL", yamlConfig.auth.url),
    clientId: env("AUTH_CLIENT_ID", yamlConfig.auth.client_id),
    username: env("AUTH_USERNAME"),
    password: env("AUTH_PASSWORD"),
    uiEmail: env("ADAD_UI_EMAIL"),
    uiPassword: env("ADAD_UI_PASSWORD"),
  },
  apiBaseUrl: env("API_BASE_URL", "https://8x.dev.adad.io/api/v1/bank-reconciliation-keys"),
  database: {
    host: env("DB_HOST", yamlConfig.database.host),
    database: env("DB_NAME", yamlConfig.database.database),
    user: env("DB_USER", yamlConfig.database.user ?? ""),
    password: env("DB_PASSWORD", yamlConfig.database.password ?? ""),
    port: Number(env("DB_PORT", String(yamlConfig.database.port))),
    schema: env("DB_SCHEMA", yamlConfig.database.schema),
  },
  sftp: {
    host: env("SFTP_HOST", String(yamlConfig.sftp.host)),
    port: Number(env("SFTP_PORT", String(yamlConfig.sftp.port))),
    user: env("SFTP_USER"),
    password: env("SFTP_PASSWORD"),
  },
  ssm: {
    enabled: envBool("ENABLE_SSM_TUNNEL", Boolean(yamlConfig.ssm.enabled)),
    bastionTag: env("SSM_BASTION_TAG", yamlConfig.ssm.bastion_tag),
    region: env("AWS_REGION", yamlConfig.ssm.region),
    localPort: env("SSM_LOCAL_PORT", String(yamlConfig.ssm.local_port)),
    remotePort: env("SSM_REMOTE_PORT", String(yamlConfig.ssm.remote_port)),
    remoteHost: env("SSM_REMOTE_HOST", yamlConfig.ssm.remote_host),
    awsProfile: env("AWS_PROFILE", yamlConfig.ssm.aws_profile),
    sftpLocalPort: env("SSM_SFTP_LOCAL_PORT", String(yamlConfig.ssm.sftp_local_port)),
    sftpRemotePort: env("SSM_SFTP_REMOTE_PORT", String(yamlConfig.ssm.sftp_remote_port)),
    sftpRemoteHost: env("SSM_SFTP_REMOTE_HOST", yamlConfig.ssm.sftp_remote_host),
  },
  files: {
    salePath: path.join(PROJECT_ROOT, molecule.sale_file_path),
    saleFileName: molecule.sale_file as string,
    saleFile: path.join(PROJECT_ROOT, molecule.sale_file_path, molecule.sale_file),
    paymentDateRange: molecule.payment_date_range as string,
    settlementPath: path.join(PROJECT_ROOT, molecule.settlement_file_path),
    settlementFileName: molecule.settlement_file as string,
    settlementFile: path.join(PROJECT_ROOT, molecule.settlement_file_path, molecule.settlement_file),
    settlementDateRange: molecule.settlement_date_range as string,
  },
  adadPaths: {
    sales: yamlConfig.adad_paths.sales as string,
    settlement: yamlConfig.adad_paths.settlement_global as string,
  },
};
