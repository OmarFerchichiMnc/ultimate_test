import { test, expect } from "@playwright/test";
import { TestPoint } from "../../src/testpoint/TestPoint";
import { runTestPoints } from "../runTestPoints";

test.describe("TestPoint", () => {
  test("marks execution passed after a successful run", async () => {
    const point = new TestPoint("TP-FW", "noop testpoint", async () => {
      expect(true).toBeTruthy();
    });
    expect(point.execution).toBe("failed");
    await point.run({} as never);
    expect(point.execution).toBe("passed");
  });

  test("returns itself so runs can be chained", async () => {
    const point = new TestPoint("TP-FW", "noop testpoint", async () => undefined);
    await expect(point.run({} as never)).resolves.toBe(point);
  });

  test("marks execution failed and rethrows the original error", async () => {
    const point = new TestPoint("TP-FW", "failing testpoint", async () => {
      throw new Error("boom");
    });
    await expect(point.run({} as never)).rejects.toThrow("boom");
    expect(point.execution).toBe("failed");
  });

  test("a passed point is marked failed when a later run fails", async () => {
    let fail = false;
    const point = new TestPoint("TP-FW", "flaky testpoint", async () => {
      if (fail) throw new Error("second run fails");
    });
    await point.run({} as never);
    expect(point.execution).toBe("passed");
    fail = true;
    await expect(point.run({} as never)).rejects.toThrow("second run fails");
    expect(point.execution).toBe("failed");
  });

  test("passes the page to the run function", async () => {
    const fakePage = { marker: "page" };
    let received: unknown;
    const point = new TestPoint("TP-FW", "page testpoint", async (page) => {
      received = page;
    });
    await point.run(fakePage as never);
    expect(received).toBe(fakePage);
  });

  test("defaults ticket id and status", () => {
    const point = new TestPoint("TP-FW", "defaults", async () => undefined);
    expect(point.ticketId).toBe("*****");
    expect(point.status).toBe("ready");
  });
});

test.describe("runTestPoints", () => {
  test("runs points in order", async () => {
    const order: string[] = [];
    const points = ["A", "B", "C"].map(
      (id) => new TestPoint(id, `point ${id}`, async () => void order.push(id)),
    );
    await runTestPoints({} as never, points);
    expect(order).toEqual(["A", "B", "C"]);
    expect(points.every((point) => point.execution === "passed")).toBe(true);
  });

  test("stops at the first failing point", async () => {
    const order: string[] = [];
    const points = [
      new TestPoint("A", "passes", async () => void order.push("A")),
      new TestPoint("B", "fails", async () => {
        order.push("B");
        throw new Error("B failed");
      }),
      new TestPoint("C", "never runs", async () => void order.push("C")),
    ];
    await expect(runTestPoints({} as never, points)).rejects.toThrow("B failed");
    expect(order).toEqual(["A", "B"]);
    expect(points.map((point) => point.execution)).toEqual(["passed", "failed", "failed"]);
  });

  test("accepts an empty list", async () => {
    await expect(runTestPoints({} as never, [])).resolves.toBeUndefined();
  });
});
