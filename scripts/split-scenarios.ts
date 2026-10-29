import fs from "fs";
import path from "path";
import { config } from "../src/configuration/config";
import { profileFor } from "../src/generation/scenarioProfiles";
import {
  DATE,
  DOCUMENT,
  emittedArgs,
  emittedClass,
  loadScenarios,
  localFixture,
  PNR,
  ScenarioStep,
} from "../tests/scenarios/catalog";

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "tests/scenarios");
const injection = new Set(["BastionSsmForward", "PrepareUpload", "ExecuteUpload", "WaitForFileInjection", "InjectFile"]);
const uploadClasses = new Set(["PrepareUpload", "ExecuteUpload", "InjectFile"]);
const uploadedFileClasses = new Set(["FileDashboardFilterUploadedFile", "CheckIfFileIngested", "AlertsAssertMissingFile"]);
const pnrClasses = /FilterPNROrderReference$|^SecondaryMatchingAssertMolecule$/;

type FileKind = "sale" | "settlement";

/** Values of the old static fixture that are replaced by the generated dataset. */
const generatedValues: Record<string, string> = {
  [DATE]: "data.paymentDateRange",
  [DOCUMENT]: "data.documentNumber",
  "827919": "data.ccBin",
  "6395": "data.ccFourLastDigits",
  "148256": "data.approvalCode",
  CCVI: "data.fopCode",
  EXTASO: "data.fopSubCode",
  "16/01/2026": "data.paymentDateUi",
  "2026-01-16T00:00:00Z": "data.paymentDateIso",
};

type RenderContext = {
  step: ScenarioStep;
  className: string;
  generated: boolean;
  /** File most recently uploaded in this scenario. */
  current?: FileKind;
};

function literal(value: unknown, ctx: RenderContext): string {
  const { step, generated } = ctx;
  if (typeof value === "string") {
    if (generated) {
      if (value === config.files.saleFileName) return "data.sale.fileName";
      if (value === config.files.settlementFileName) return "data.settlement.fileName";
      if (value === config.files.salePath || value === config.files.settlementPath) return "data.dir";
      if (value === PNR && pnrClasses.test(ctx.className)) return "data.pnrReference";
      if (generatedValues[value]) return generatedValues[value];
    }
    if (value === config.files.saleFileName) return "config.files.saleFileName";
    if (value === config.files.settlementFileName) return "config.files.settlementFileName";
    if (value === config.adadPaths.sales) return "config.adadPaths.sales";
    if (value === config.adadPaths.settlement) return "config.adadPaths.settlement";
    if (value === config.files.salePath || value === config.files.settlementPath) {
      return localFixture(step) === "settlement" ? "config.files.settlementPath" : "config.files.salePath";
    }
    return JSON.stringify(value);
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[${value.map((item) => literal(item, ctx)).join(", ")}]`;
  throw new Error(`Cannot render argument ${String(value)}`);
}

function uploadedKind(args: unknown[]): FileKind | undefined {
  if (args.includes(config.files.settlementFileName)) return "settlement";
  if (args.includes(config.files.saleFileName)) return "sale";
  return undefined;
}

function renderArgs(step: ScenarioStep, ctx: RenderContext): string {
  const className = emittedClass(step);
  const args = emittedArgs(step);
  if (ctx.generated && ctx.current) {
    // Always point at the file that was actually uploaded last (fixes sale/settlement mix-ups).
    if (uploadedFileClasses.has(className)) return `data.${ctx.current}.fileName`;
    if (className === "FileDashboardAssertTotalTransactions") {
      return `data.${ctx.current}.count, data.${ctx.current}.eligible`;
    }
  }
  return args.map((value) => literal(value, { ...ctx, className })).join(", ");
}

function profileLiteral(profile: object): string {
  const entries = Object.entries(profile).map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  return entries.length ? `, { ${entries.join(", ")} }` : "";
}

for (const scenario of loadScenarios()) {
  const generated = scenario.steps.some((step) => uploadClasses.has(emittedClass(step)));
  const classes = [...new Set(scenario.steps.map((step) => emittedClass(step)))];
  const pageClasses = classes.filter((name) => !injection.has(name) && !name.startsWith("TestPointNavigate"));
  const injectionClasses = classes.filter((name) => injection.has(name));
  const navigationClasses = classes.filter((name) => name.startsWith("TestPointNavigate"));

  const ctx: RenderContext = { step: scenario.steps[0], className: "", generated };
  const calls: string[] = [];
  if (generated) calls.push("      new GenerateScenarioFiles(data),");
  for (const step of scenario.steps) {
    const className = emittedClass(step);
    if (generated && uploadClasses.has(className)) {
      ctx.current = uploadedKind(emittedArgs(step)) ?? ctx.current;
    }
    calls.push(`      new ${className}(${renderArgs(step, { ...ctx, step })}),`);
  }

  const usesConfig = calls.some((line) => line.includes("config."));
  const imports = [
    `import { test } from "../../src/fixtures/auth";`,
    `import { runTestPoints } from "../runTestPoints";`,
  ];
  if (usesConfig) imports.push(`import { config } from "../../src/configuration/config";`);
  if (generated) imports.push(`import { GenerateScenarioFiles, scenarioDataset } from "../../src/generation";`);
  if (pageClasses.length) {
    imports.push(`import { ${pageClasses.join(", ")} } from "../../src/pages";`);
  }
  if (injectionClasses.length) {
    imports.push(`import { ${injectionClasses.join(", ")} } from "../../src/configuration/fileInjection";`);
  }
  if (navigationClasses.length) {
    imports.push(`import { ${navigationClasses.join(", ")} } from "../../src/navigation/navigationByLink";`);
  }
  const dataLine = generated
    ? `    const data = scenarioDataset(${JSON.stringify(scenario.id)}${profileLiteral(profileFor(scenario.id, scenario.summary))});\n`
    : "";
  const source = `${imports.join("\n")}

test.describe(${JSON.stringify(scenario.domain)}, () => {
  test(${JSON.stringify(`${scenario.id} ${scenario.summary}`)}, async ({ loggedInPage }) => {
    test.setTimeout(600_000);
${dataLine}    await runTestPoints(loggedInPage, [
${calls.join("\n")}
    ]);
  });
});
`;
  fs.writeFileSync(path.join(outDir, `${scenario.id}.spec.ts`), source);
}

fs.rmSync(path.join(outDir, "catalog.spec.ts"), { force: true });
console.log(`Wrote ${loadScenarios().length} scenario files`);
