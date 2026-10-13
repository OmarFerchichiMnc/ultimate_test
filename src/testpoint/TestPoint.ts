import { Page } from "@playwright/test";
import { logger } from "../configuration/logger";

export class TestPoint {
  execution: "passed" | "failed" = "failed";

  constructor(
    public id: string,
    public description: string,
    public func: (page: Page) => Promise<void>,
    public ticketId = "*****",
    public status = "ready",
  ) {}

  async run(page: Page): Promise<this> {
    logger.info(`Running TestPoint ${this.id}: ${this.description}`);
    try {
      await this.func(page);
      this.execution = "passed";
    } catch (error) {
      this.execution = "failed";
      logger.error(`TestPoint ${this.id} failed: ${String(error)}`);
      throw error;
    }
    return this;
  }
}
