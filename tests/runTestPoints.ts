import { Page } from "@playwright/test";
import { TestPoint } from "../src/testpoint/TestPoint";

export async function runTestPoints(page: Page, points: TestPoint[]): Promise<void> {
  for (const point of points) {
    await point.run(page);
  }
}
