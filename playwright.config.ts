import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import { getRemoteBrowserUrl } from "./config/browser.setup";
import { env } from "./config/env.config";

// playwright "testDir" harus berupa direktori, bukan glob wildcard
const playwrightTestDir = "./tests";
const bddGeneratedDir = `${playwrightTestDir}/generated`;

const bddConfig = defineBddConfig({
  features: ["tests/features/**/*.feature"],
  steps: ["tests/fixtures/pages.fixture.ts", "tests/steps/index.ts"],
  outputDir: bddGeneratedDir,
});

const defaultReporter = [
  ["html"],
  ["line"],
  [
    "allure-playwright",
    {
      resultsDir: "allure-results",
      detail: true,
      suiteTitle: true,
    },
  ],
];

const reportPortalReporter = [
  ["html"],
  ["line"],
  [
    "@reportportal/agent-js-playwright",
    {
      apiKey: process.env.REPORT_PORTAL_API_KEY ?? "",
      endpoint: process.env.REPORT_PORTAL_ENDPOINT ?? "",
      project: "EClinic-E2E",
      launch: "End-Ro-End Tests",
      attributes: [
        {
          key: "application-branch",
          value: process.env.APPLICATION_BRANCH ?? "master",
        },
        {
          key: "scenario-branch",
          value: process.env.SCENARIO_BRANCH ?? "master",
        },
      ],
      description: "Regression end-to-end tests for EClinic application",
    },
  ],
];

// Get remote browser URL once to avoid duplicate calls
const remoteBrowserUrl = getRemoteBrowserUrl();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...(bddConfig as any),
  // Set root testDir to generated directory to satisfy playwright-bdd
  // Individual projects will override this to access both BDD and non-BDD tests
  testDir: bddGeneratedDir,
  timeout: 60_000,
  fullyParallel: true,
  use: {
    baseURL: env.BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      headless: env.HEADLESS,
    },
  },

  projects: [
    {
      name: "setup",
      testDir: "./tests/setup",
      testMatch: /.*\.setup\.ts$/,
    },
    {
      name: "bdd",
      testDir: bddGeneratedDir,
      testMatch: /.*\.spec\.js$/,
      use: {
        ...devices["Desktop Chrome"],
        ...(remoteBrowserUrl
          ? {
              connectOverCDP: remoteBrowserUrl,
            }
          : {
              headless: process.env.HEADLESS !== "false",
              launchOptions: {
                devtools: false,
              },
            }),
      },
      dependencies: ["setup"],
    },
    {
      name: "chromium",
      testDir: playwrightTestDir,
      testMatch: /.*\.spec\.ts$/,
      testIgnore: [/.*generated.*/],
      use: {
        ...devices["Desktop Chrome"],
        ...(remoteBrowserUrl
          ? {
              connectOverCDP: remoteBrowserUrl,
            }
          : {
              headless: process.env.HEADLESS !== "false",
              launchOptions: {
                devtools: false,
              },
            }),
      },
      dependencies: ["setup"],
    },
  ],

  webServer: undefined,
});
