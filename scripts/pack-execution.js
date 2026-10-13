#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const latest = path.join(process.cwd(), "reports", "latest");
if (!fs.existsSync(latest)) {
  console.error("No reports/latest. Run npm test first.");
  process.exit(1);
}

const runDir = fs.realpathSync(latest);
const stamp = path.basename(runDir);
const out = path.join(process.cwd(), "reports", `${stamp}.zip`);
if (fs.existsSync(out)) fs.unlinkSync(out);

const zip = spawnSync("zip", ["-r", "-q", out, ".", "-x", "html/*"], { cwd: runDir, stdio: "inherit" });
if (zip.error || zip.status) {
  const py = spawnSync(
    "python3",
    ["-c", "import shutil, sys; shutil.make_archive(sys.argv[1], 'zip', sys.argv[2])", out.replace(/\.zip$/, ""), runDir],
    { stdio: "inherit" },
  );
  if (py.error || py.status) {
    console.error("Could not create ZIP. Install zip or python3.");
    process.exit(1);
  }
}

console.log(`Packed one execution: ${out}`);
console.log("Import this ZIP into QA TestPoint Analytics.");
