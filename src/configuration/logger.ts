import fs from "fs";
import path from "path";
import { reportPath } from "./reportRun";

let currentLogFile = "";

export function startTestLog(testFile: string, testName: string): string {
  const folder = reportPath("logs");
  fs.mkdirSync(folder, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeName = `${testFile}_${testName}_${stamp}`.replace(/[^\w.-]+/g, "_");
  currentLogFile = path.join(folder, `${safeName}.log`);
  fs.writeFileSync(currentLogFile, `--- Starting test: ${testName} ---\n`);
  return currentLogFile;
}

export const logger = {
  info(message: string): void {
    write("INFO", message);
  },
  warn(message: string): void {
    write("WARN", message);
  },
  error(message: string): void {
    write("ERROR", message);
  },
};

function write(level: string, message: string): void {
  const line = `${new Date().toISOString()} - ${level} - ${message}`;
  console.log(line);
  if (currentLogFile) {
    fs.appendFileSync(currentLogFile, `${line}\n`);
  }
}
