// TestPoints used by the scenario specs (database). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { logger } from "../configuration/logger";
import {
  CreationDateTable,
  shiftCreationDate,
  shiftSaleCreatedDatesByDocument,
  shiftSaleRefundCreatedDates,
} from "../configuration/database";
import { TestPoint } from "../testpoint/TestPoint";

export class DbShiftCreationDate extends TestPoint {
  constructor(table: CreationDateTable, id: string, createdDate: string) {
    super("TP-NEW-011", `Shift ${table} ${id} created date to ${createdDate}`, async () => {
      logger.info(`Shifted ${table} ${id} created date to ${createdDate}`);
      await shiftCreationDate(table, id, createdDate);
    });
  }
}

export class DbShiftSaleRefundCreatedDates extends TestPoint {
  /** `days` comes from the test case: created_date = created_date - interval '<days> day'. */
  constructor(paymentId: string, days: number) {
    super("TP-NEW-011A", `Shift sale/refund rows for payment ${paymentId} back by ${days} day(s)`, async () => {
      await shiftSaleRefundCreatedDates(paymentId, days);
      logger.info(`Shifted sale rows for payment ${paymentId} back by ${days} day(s)`);
    });
  }
}

/** `days` comes from the test case: created_date = created_date - interval '<days> day'. */
export class DbShiftSaleCreatedDatesByDocument extends TestPoint {
  constructor(documentNumbers: string[], days: number) {
    super(
      "TP-NEW-011B",
      `Shift sale/refund rows of ${documentNumbers.length} document(s) back by ${days} day(s)`,
      async () => {
        const updated = await shiftSaleCreatedDatesByDocument(documentNumbers, days);
        logger.info(`Shifted ${updated} sale row(s) back by ${days} day(s)`);
        if (updated === 0) {
          throw new Error(`No sale rows found for documents ${documentNumbers.join(", ")}`);
        }
      },
    );
  }
}
