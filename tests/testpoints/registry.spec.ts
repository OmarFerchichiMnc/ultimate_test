import { test, expect } from "@playwright/test";
import { allInventoryTestPoints, inventorySuites } from "./suites";

test.describe("TestPoint registry", () => {
  test("every page exposes inspect TestPoints", () => {
    const suites = inventorySuites();
    expect(suites.length).toBeGreaterThan(0);

    for (const suite of suites) {
      expect(suite.path, "page is missing a path").toMatch(/^\//);
      expect(suite.testpoints.length, `${suite.path} has no TestPoints`).toBeGreaterThan(1);

      const [open, ...controls] = suite.testpoints;
      expect(open.id, `${suite.path} first TestPoint should open the page`).toMatch(/^TP-OPEN-/);
      expect(open.description).toContain(suite.path);
      expect(controls.length, `${suite.path} has no control TestPoints`).toBeGreaterThan(0);

      for (const testpoint of controls) {
        expect(testpoint.id, `${suite.path} control is missing an id`).toMatch(/^TP-BTN-/);
        expect(testpoint.description.trim(), `${testpoint.id} has an empty description`).not.toBe("");
        expect(typeof testpoint.func, `${testpoint.id} has no run function`).toBe("function");
      }
    }
  });

  test("TestPoint IDs are unique across every page", () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];

    for (const suite of inventorySuites()) {
      for (const testpoint of suite.testpoints) {
        const previous = seen.get(testpoint.id);
        if (previous) {
          duplicates.push(`${testpoint.id} on ${suite.path} and ${previous}`);
        } else {
          seen.set(testpoint.id, suite.path);
        }
      }
    }

    expect(duplicates, duplicates.join("\n")).toEqual([]);
    expect(seen.size).toBe(allInventoryTestPoints().length);
  });

  test("destructive controls are inspect-only and are not clicked", () => {
    const violations: string[] = [];

    for (const testpoint of allInventoryTestPoints()) {
      const inspectOnly = testpoint.status === "inspect-only";
      const labeledDoNotClick = /do not click/i.test(testpoint.description);
      if (inspectOnly !== labeledDoNotClick) {
        violations.push(`${testpoint.id}: status=${testpoint.status} description="${testpoint.description}"`);
      }
    }

    expect(violations, violations.join("\n")).toEqual([]);
  });

  test("every inspect TestPoint can be constructed and reports failed until run", () => {
    for (const testpoint of allInventoryTestPoints()) {
      expect(testpoint.execution).toBe("failed");
      expect(testpoint.ticketId).toBeTruthy();
    }
  });
});
