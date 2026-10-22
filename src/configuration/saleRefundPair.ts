import fs from "fs";
import path from "path";
import SftpClient from "ssh2-sftp-client";
import { config } from "./config";
import { ensureSftpTunnel } from "./ssmTunnel";

export type SaleRefundThresholds = {
    eligibleRefundsDurationInDays: number;
    maximumSalesAndRefundsSecondaryMatchingDiscrepancyAmountPercentage: number;
    salesAndRefundsSecondaryMatchingThresholdMonoFixedAmountInGlobalCurrency: number;
};

export type SaleRefundPair = {
    documentNumber: string;
    paymentId: string;
    ccBin: string;
    ccFourLastDigits: string;
    fopCode: string;
    fileName: string;
    filePath: string;
    remotePath: string;
    salesAndRefundsThresholds: SaleRefundThresholds;
    saleRecord: Record<string, string>;
    refundRecord: Record<string, string>;
    records: Record<string, string>[];
};

const saleFileHeaders = [
    "agentCode",
    "pnrReference",
    "passengerName",
    "passengerType",
    "documentNumber",
    "documentType",
    "transactionCode",
    "transactionType",
    "reasonForIssuanceCode",
    "paymentDate",
    "alternateFormOfPaymentCode",
    "approvalCode",
    "invoiceNumber",
    "grossAmountInPaymentCurrency",
    "paymentCurrency",
    "ccNumber",
    "ccBin",
    "ccFourLastDigits",
    "airline",
    "company",
    "orderId",
    "paymentId",
    "customerProfileId",
    "saleChannelType",
    "officeId",
    "additionalReferenceKey1",
    "additionalReferenceKey2",
    "additionalReferenceKey3",
    "serviceType",
    "totalInstallmentCount",
    "city",
    "country",
    "periodFrom",
    "periodTo",
    "reportingSystemIdentifier",
    "grossAmountInSaleCurrency",
    "saleCurrency",
    "originalFirstIssuanceDate",
    "fopSubCode",
    "alternateOfficeId",
    "pspMid",
    "psp",
] as const;

function pad(value: number): string {
    return `${value}`.padStart(2, "0");
}

function buildTimestamp(): string {
    const now = new Date();
    return [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
    ].join("") + "-" + [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join("");
}

function buildFileStamp(): string {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
}

function makeSaleRow({
    documentNumber,
    pnrReference,
    paymentDate,
    amount,
    paymentId,
    paymentDateRefund,
    refundAmount,
    transactionType,
}: {
    documentNumber: string;
    pnrReference: string;
    paymentDate: string;
    amount: string;
    paymentId: string;
    paymentDateRefund: string;
    refundAmount: string;
    transactionType: "SALE" | "REFUND";
}): Record<string, string> {
    return {
        agentCode: "20300744",
        pnrReference,
        passengerName: "chakib",
        passengerType: "ADT",
        documentNumber,
        documentType: "Ticket",
        transactionCode: "TKTT",
        transactionType,
        reasonForIssuanceCode: "",
        paymentDate: transactionType === "SALE" ? paymentDate : paymentDateRefund,
        alternateFormOfPaymentCode: "MSCC",
        approvalCode: "142533",
        invoiceNumber: "AX232220609938",
        grossAmountInPaymentCurrency: amount,
        paymentCurrency: "USD",
        ccNumber: "623695XXXXX9734",
        ccBin: "623695",
        ccFourLastDigits: "9734",
        airline: "",
        company: "",
        orderId: "",
        paymentId,
        customerProfileId: "",
        saleChannelType: "INDIRECT",
        officeId: "20300744",
        additionalReferenceKey1: "",
        additionalReferenceKey2: "",
        additionalReferenceKey3: "",
        serviceType: "PASSENGER",
        totalInstallmentCount: "",
        city: "TUN",
        country: "TU",
        periodFrom: "2023-05-13",
        periodTo: "2024-05-13",
        reportingSystemIdentifier: "",
        grossAmountInSaleCurrency: amount,
        saleCurrency: "USD",
        originalFirstIssuanceDate: "2026-02-04",
        fopSubCode: "EXTAAL",
        alternateOfficeId: "690334",
        pspMid: "301182",
        psp: "251744",
    };
}

export function buildSaleRefundPair(): SaleRefundPair {
    const paymentId = "1122334455";
    const ccBin = "623695";
    const ccFourLastDigits = "9734";
    const fopCode = "MSCC";
    const salesAndRefundsThresholds = {
        eligibleRefundsDurationInDays: 30,
        maximumSalesAndRefundsSecondaryMatchingDiscrepancyAmountPercentage: 5,
        salesAndRefundsSecondaryMatchingThresholdMonoFixedAmountInGlobalCurrency: 100,
    };

    const documentPairs = [
        { documentNumber: "2127940546395", pnrReference: "Q6P109", paymentDate: "2026-01-26", paymentDateRefund: "2026-01-27", amount: "100", refundAmount: "99" },
        { documentNumber: "2127940546396", pnrReference: "Q6P111", paymentDate: "2026-01-28", paymentDateRefund: "2026-01-29", amount: "99", refundAmount: "100" },
        { documentNumber: "2127940546397", pnrReference: "Q6P113", paymentDate: "2026-01-30", paymentDateRefund: "2026-01-31", amount: "150", refundAmount: "50" },
        { documentNumber: "2127940546398", pnrReference: "Q6P115", paymentDate: "2026-02-01", paymentDateRefund: "2026-02-02", amount: "150", refundAmount: "50" },
        { documentNumber: "2127940546399", pnrReference: "Q6P117", paymentDate: "2026-02-03", paymentDateRefund: "2026-02-04", amount: "150", refundAmount: "50" },
    ];

    const records = documentPairs.flatMap(({ documentNumber, pnrReference, paymentDate, paymentDateRefund, amount, refundAmount }) => [
        makeSaleRow({ documentNumber, pnrReference, paymentDate, amount, paymentDateRefund, refundAmount, paymentId, transactionType: "SALE" }),
        makeSaleRow({ documentNumber, pnrReference, paymentDate, amount, paymentDateRefund, refundAmount, paymentId, transactionType: "REFUND" }),
    ]);

    const primaryDocumentNumber = documentPairs[0].documentNumber;
    const saleRecord = records[0];
    const refundRecord = records[1];
    const fileStamp = buildFileStamp();
    const fileName = `Sale_GLOBAL_10_2_${fileStamp}.csv`;
    const filePath = path.join(config.projectRoot, "docs/test_files", "sale_refund_pair", fileName);

    return {
        documentNumber: primaryDocumentNumber,
        paymentId,
        ccBin,
        ccFourLastDigits,
        fopCode,
        fileName,
        filePath,
        remotePath: `${config.adadPaths.sales.replace(/\/$/, "")}/${fileName}`,
        salesAndRefundsThresholds,
        saleRecord,
        refundRecord,
        records,
    };
}

export async function uploadSaleRefundPair(pair: SaleRefundPair): Promise<{ fileName: string; filePath: string; remotePath: string }> {
    const directory = path.dirname(pair.filePath);
    fs.mkdirSync(directory, { recursive: true });

    const csv = [
        saleFileHeaders.join(","),
        ...pair.records.map((record) => saleFileHeaders.map((header) => record[header] ?? "").join(",")),
    ].join("\n");

    fs.writeFileSync(pair.filePath, csv, "utf8");

    if (!config.sftp.user || !config.sftp.password) {
        throw new Error("SFTP credentials are missing. Set SFTP_USER and SFTP_PASSWORD in .env");
    }

    await ensureSftpTunnel();
    const client = new SftpClient();
    await client.connect({
        host: "127.0.0.1",
        port: Number(config.ssm.sftpLocalPort),
        username: config.sftp.user,
        password: config.sftp.password,
    });

    try {
        await client.put(pair.filePath, pair.remotePath);
    } finally {
        await client.end();
    }

    return {
        fileName: pair.fileName,
        filePath: pair.filePath,
        remotePath: pair.remotePath,
    };
}
