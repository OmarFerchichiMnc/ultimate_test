import fs from "fs";
import path from "path";
import { config } from "../src/configuration/config";
import { emittedArgs, emittedClass, loadScenarios, localFixture, ScenarioStep } from "../tests/scenarios/catalog";

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "tests/scenarios");
const injection = new Set(["BastionSsmForward", "PrepareUpload", "ExecuteUpload", "WaitForFileInjection", "InjectFile"]);

function literal(value: unknown, step: ScenarioStep): string {
  if (typeof value === "string") {
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
  if (Array.isArray(value)) return `[${value.map((item) => literal(item, step)).join(", ")}]`;
  throw new Error(`Cannot render argument ${String(value)}`);
}

for (const scenario of loadScenarios()) {
  const classes = [...new Set(scenario.steps.map((step) => emittedClass(step)))];
  const pageClasses = classes.filter((name) => !injection.has(name) && !name.startsWith("TestPointNavigate"));
  const injectionClasses = classes.filter((name) => injection.has(name));
  const navigationClasses = classes.filter((name) => name.startsWith("TestPointNavigate"));
  const calls = scenario.steps.map((step) => {
    const args = emittedArgs(step).map((value) => literal(value, step)).join(", ");
    return `      new ${emittedClass(step)}(${args}),`;
  });
  const usesConfig = calls.some((line) => line.includes("config."));
  const imports = [
    `import { test } from "../../src/fixtures/auth";`,
    `import { runTestPoints } from "../runTestPoints";`,
  ];
  if (usesConfig) imports.push(`import { config } from "../../src/configuration/config";`);
  if (pageClasses.length) {
    imports.push(`import { ${pageClasses.join(", ")} } from "../../src/pages";`);
  }
  if (injectionClasses.length) {
    imports.push(`import { ${injectionClasses.join(", ")} } from "../../src/configuration/fileInjection";`);
  }
  if (navigationClasses.length) {
    imports.push(`import { ${navigationClasses.join(", ")} } from "../../src/navigation/navigationByLink";`);
  }
  const source = `${imports.join("\n")}

test.describe(${JSON.stringify(scenario.domain)}, () => {
  test(${JSON.stringify(`${scenario.id} ${scenario.summary}`)}, async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
${calls.join("\n")}
    ]);
  });
});
`;
  fs.writeFileSync(path.join(outDir, `${scenario.id}.spec.ts`), source);
}

fs.rmSync(path.join(outDir, "catalog.spec.ts"), { force: true });
console.log(`Wrote ${loadScenarios().length} scenario files`);
