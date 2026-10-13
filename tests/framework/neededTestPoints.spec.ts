import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";
import * as pages from "../../src/pages";
import * as fileInjection from "../../src/configuration/fileInjection";
import { neededTestPointSamples } from "../../src/pages/neededTestPoints";

const catalogDir = path.resolve(__dirname, "../../docs/test_scenarios");
const exported: Record<string, unknown> = { ...pages, ...fileInjection };

function readCsv(file: string): Record<string, string>[] {
  const text = fs.readFileSync(path.join(catalogDir, file), "utf8");
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      records.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    records.push(row);
  }
  const [header, ...body] = records.filter((record) => record.some((value) => value !== ""));
  return body.map((values) => Object.fromEntries(header.map((name, index) => [name, values[index] ?? ""])));
}

test.describe("scenario TestPoints", () => {
  test("every planned TestPoint is implemented with a unique id", () => {
    const points = neededTestPointSamples();
    expect(points).toHaveLength(123);

    const ids = points.map((point) => point.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (let index = 1; index <= 123; index += 1) {
      expect(ids).toContain(`TP-NEW-${String(index).padStart(3, "0")}`);
    }

    for (const point of points) {
      expect(point.description.trim(), `${point.id} has an empty description`).not.toBe("");
      expect(typeof point.func, `${point.id} has no run function`).toBe("function");
      expect(point.execution, `${point.id} should start as failed`).toBe("failed");
    }
  });

  test("catalog ids map to the class that implements them", () => {
    const byId = new Map(neededTestPointSamples().map((point) => [point.id, point.constructor.name]));
    const mismatches = readCsv("adad_testpoints.csv")
      .filter((row) => row.testpoint_id.startsWith("TP-NEW-"))
      .filter((row) => byId.get(row.testpoint_id) !== row.testpoint_class)
      .map((row) => `${row.testpoint_id}: catalog=${row.testpoint_class} code=${byId.get(row.testpoint_id)}`);

    expect(mismatches, mismatches.join("\n")).toEqual([]);
  });

  test("every catalog TestPoint marked done is exported", () => {
    const missing = readCsv("adad_testpoints.csv")
      .filter((row) => row.implementation === "done")
      .filter((row) => typeof exported[row.testpoint_class] !== "function")
      .map((row) => `${row.testpoint_id} ${row.testpoint_class} (${row.source_file})`);

    expect(missing, missing.join("\n")).toEqual([]);
  });

  test("every scenario step uses an exported TestPoint class", () => {
    const rows = readCsv("adad_test_scenarios.csv");
    expect(rows.length).toBeGreaterThan(0);

    const missing = [
      ...new Set(
        rows
          .filter((row) => typeof exported[row.testpoint_class] !== "function")
          .map((row) => `${row.testpoint_class} (first used by ${row.scenario_id} step ${row.step})`),
      ),
    ];
    expect(missing, missing.join("\n")).toEqual([]);
  });

  test("scenario steps are numbered without gaps", () => {
    const steps = new Map<string, number[]>();
    for (const row of readCsv("adad_test_scenarios.csv")) {
      steps.set(row.scenario_id, [...(steps.get(row.scenario_id) ?? []), Number(row.step)]);
    }
    const broken = [...steps]
      .filter(([, numbers]) => numbers.some((value, index) => value !== index + 1))
      .map(([id]) => id);

    expect(broken, broken.join(", ")).toEqual([]);
  });
});
