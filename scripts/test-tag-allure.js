const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const forwardedArgs = process.argv.slice(2);
const rootDir = process.cwd();
const allureResultsDir = path.join(rootDir, "allure-results");
const allureReportDir = path.join(rootDir, "allure-report");

// Ensure report only contains current run results.
fs.rmSync(allureResultsDir, { recursive: true, force: true });
fs.rmSync(allureReportDir, { recursive: true, force: true });

run("npx", ["bddgen"]);
run("npx", ["playwright", "test", "--project=bdd", ...forwardedArgs]);
run("npx", ["-y", "allure-commandline", "generate", "allure-results", "--clean", "-o", "allure-report"]);
run("npx", ["-y", "allure-commandline", "open", "allure-report"]);