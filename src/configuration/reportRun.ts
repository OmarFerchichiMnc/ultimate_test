import fs from "fs";
import path from "path";

const ENV_KEY = "ADAD_REPORT_DIR";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function runStamp(): string {
  const date = new Date();
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + "_" + [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join("-");
}

function reportsRoot(): string {
  return path.join(process.cwd(), "reports");
}

function pointLatestAt(runDir: string): void {
  const latest = path.join(reportsRoot(), "latest");
  try {
    fs.unlinkSync(latest);
  } catch {
    // first run, or latest is not a symlink yet
  }
  fs.symlinkSync(path.basename(runDir), latest);
}

export function reportRunDir(): string {
  const existing = process.env[ENV_KEY];
  if (existing) {
    fs.mkdirSync(existing, { recursive: true });
    return existing;
  }

  // Workers reload playwright.config; join the folder this execution already created.
  if (process.env.PW_TEST_WORKER_INDEX !== undefined) {
    const latest = path.join(reportsRoot(), "latest");
    if (fs.existsSync(latest)) {
      const dir = fs.realpathSync(latest);
      process.env[ENV_KEY] = dir;
      return dir;
    }
  }

  const root = reportsRoot();
  fs.mkdirSync(root, { recursive: true });
  let runDir = path.join(root, runStamp());
  if (fs.existsSync(runDir)) {
    runDir = `${runDir}_${process.pid}`;
  }
  fs.mkdirSync(path.join(runDir, "logs"), { recursive: true });
  fs.mkdirSync(path.join(runDir, "html"), { recursive: true });
  fs.mkdirSync(path.join(runDir, "artifacts"), { recursive: true });
  fs.mkdirSync(path.join(runDir, "testcases"), { recursive: true });
  process.env[ENV_KEY] = runDir;
  pointLatestAt(runDir);
  return runDir;
}

export function reportPath(...parts: string[]): string {
  return path.join(reportRunDir(), ...parts);
}
