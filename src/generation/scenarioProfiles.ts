import type { DataVariant, GenerationOptions, MatchingStrategy } from "./fileGenerator";

export type ScenarioProfile = Omit<GenerationOptions, "scenarioId">;

/**
 * Picks the data shape a scenario needs from its id and summary. Used by
 * scripts/split-scenarios.ts when it writes tests/scenarios/*.spec.ts.
 */
export function profileFor(scenarioId: string, summary: string): ScenarioProfile {
  const text = summary.toLowerCase();

  let strategy: MatchingStrategy = "documentNumberAndFop";
  if (/many-to-many/.test(text)) strategy = "manyToMany";
  else if (/one-to-many/.test(text)) strategy = "oneToMany";
  else if (/many-to-one/.test(text)) strategy = "manyToOne";

  const byId: Record<string, DataVariant> = {
    "DI-08": "duplicateTransaction",
    "DI-09": "corruptedRecord",
    "DI-10": "unknownFop",
    "DI-11": "unknownOffice",
    "DI-12": "missingMerchant",
    "DI-13": "missingRoe",
    "DI-05": "corruptedStructure",
  };
  let variant: DataVariant = byId[scenarioId] ?? "valid";
  if (variant === "valid" && /discrepan/.test(text)) variant = "amountDiscrepancy";

  const profile: ScenarioProfile = { strategy };
  if (variant !== "valid") profile.variant = variant;
  if (/multi-currency/.test(text)) profile.multiCurrency = true;
  if (/sale and refund|sale and a refund|sale vs refund/.test(text)) profile.withRefunds = true;
  return profile;
}
