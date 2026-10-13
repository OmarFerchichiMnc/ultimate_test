import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import fs from "fs";
import path from "path";
import { reportPath, reportRunDir } from "./reportRun";

const TP_RUN_RE = /Running TestPoint\s+([A-Za-z0-9._-]+)\s*:\s*(.+)$/i;

function stdoutText(result: TestResult): string {
  return result.stdout
    .map((chunk) => (typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8")))
    .join("");
}

function synthesizeId(rawId: string | undefined, description: string): string {
  if (rawId && rawId !== "TP") return rawId;
  const slug = description
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug ? `TP-${slug}` : "TP";
}

function pointsFrom(result: TestResult): Array<Record<string, unknown>> {
  const points: Array<Record<string, unknown>> = [];
  for (const line of stdoutText(result).split("\n")) {
    const cleaned = line.replace(/^\d{4}-\d{2}-\d{2}T[\d:.+-]+Z?\s*-\s*(INFO|ERROR|WARN)\s*-\s*/i, "");
    const match = cleaned.match(TP_RUN_RE);
    if (!match) continue;
    const description = match[2]?.trim() ?? "TestPoint";
    points.push({
      id: synthesizeId(match[1], description),
      description,
      ticket_id: "*****",
      status: "ready",
      execution: "passed",
    });
  }
  if (result.status === "failed" || result.status === "timedOut") {
    const last = points[points.length - 1];
    if (last) {
      last.execution = "failed";
      last.error = result.error?.message ?? "failed";
      last.stack = result.error?.stack;
    }
  }
  return points;
}

function caseId(test: TestCase): string {
  return test.title.trim().replace(/\s+/g, "_");
}

export default class AdadReporter implements Reporter {
  private started = new Date();

  onBegin(): void {
    fs.mkdirSync(reportPath("testcases"), { recursive: true });
    fs.mkdirSync(reportPath("logs"), { recursive: true });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const id = caseId(test);
    const failed = result.status !== "passed" && result.status !== "skipped";
    const points = pointsFrom(result);
    if (!points.length) {
      points.push({
        id: synthesizeId(undefined, test.title),
        description: test.title,
        ticket_id: "*****",
        status: "ready",
        execution: failed ? "failed" : result.status === "skipped" ? "skipped" : "passed",
        error: result.error?.message,
        stack: result.error?.stack,
      });
    }
    const doc = {
      id,
      description: test.title,
      ticket_id: "*****",
      status: "ready",
      execution: failed ? "failed" : result.status === "skipped" ? "skipped" : "passed",
      file: test.location.file,
      testpoints: points,
    };
    fs.writeFileSync(reportPath("testcases", `TestCase_${id}.json`), `${JSON.stringify(doc, null, 2)}\n`);
  }

  onEnd(result: FullResult): void {
    const logsDir = reportPath("logs");
    const names = fs.existsSync(logsDir)
      ? fs.readdirSync(logsDir).filter((name) => name.endsWith(".log")).sort()
      : [];
    const combined = names
      .map((name) => fs.readFileSync(path.join(logsDir, name), "utf8"))
      .join("")
      .replace(/([^\n])$/, "$1\n");
    fs.writeFileSync(reportPath("execution.log"), combined);
    fs.writeFileSync(
      reportPath("metadata.json"),
      `${JSON.stringify(
        {
          name: path.basename(reportRunDir()),
          startedAt: this.started.toISOString(),
          finishedAt: new Date().toISOString(),
          status: result.status,
        },
        null,
        2,
      )}\n`,
    );
  }
}
