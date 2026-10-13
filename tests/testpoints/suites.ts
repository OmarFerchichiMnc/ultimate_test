import { PAGE_INVENTORY } from "../../src/pages";
import { TestPoint } from "../../src/testpoint/TestPoint";

export type InventorySuite = {
  path: string;
  testpoints: TestPoint[];
};

export function inventorySuites(): InventorySuite[] {
  return PAGE_INVENTORY.map((page) => ({
    path: page.path,
    testpoints: page.testPoints(),
  }));
}

export function allInventoryTestPoints(): TestPoint[] {
  return inventorySuites().flatMap((suite) => suite.testpoints);
}
