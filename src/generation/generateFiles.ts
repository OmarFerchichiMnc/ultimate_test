import fs from "fs";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";
import { GeneratedFile, ScenarioDataset, writeDataset } from "./fileGenerator";

/**
 * First step of every scenario that uploads files: writes the generated Sale /
 * Settlement / BankDeposit CSVs for this run into dataset.dir.
 */
export class GenerateScenarioFiles extends TestPoint {
  constructor(dataset: ScenarioDataset, kinds: GeneratedFile["kind"][] = ["sale", "settlement", "bankDeposit"]) {
    super(
      "TP-GEN-001",
      `Generate ${kinds.join(", ")} files for ${dataset.scenarioId} (${dataset.strategy}, ${dataset.variant})`,
      async () => {
        const written = writeDataset(dataset, kinds);
        for (const file of written) {
          if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
            throw new Error(`Generated file is missing or empty: ${file}`);
          }
        }
        logger.info(`Generated ${written.length} file(s) in ${dataset.dir}`);
        logger.info(
          `Dataset ${dataset.scenarioId}: document ${dataset.documentNumber}, PNR ${dataset.pnrReference}, ` +
            `${dataset.sale.count} sale row(s), ${dataset.settlement.count} settlement row(s), payment date ${dataset.paymentDate}`,
        );
      },
    );
  }
}
