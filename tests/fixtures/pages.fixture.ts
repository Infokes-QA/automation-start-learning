import { Page } from "@playwright/test";
import { test as bddTest } from "playwright-bdd";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import path from "path";
import * as fs from "fs";
import { PasienData } from "./patientData.fixture";
import { PendaftaranPage } from "../pages/PendaftaranPage";
import { IndexPasienPage } from "../pages/IndexPasienPage";

export interface PageContext {
  page: Page;
  pages: Pages;
}

export interface Pages {
  loginPage: LoginPage;
  homePage: HomePage;
  indexPasienPage: IndexPasienPage;
  pendaftaranPage: PendaftaranPage;
}

export interface RegisteredPatientContext {
  pasienId?: string;
  nikPasien: string;
  namaPasien: string;
  phoneNumber: string;
  source: "ui";
}

// Context for storing test data between steps
export interface TestContext {
  nik?: string;
  patientDataGlobal?: PasienData;
  registeredPatient?: RegisteredPatientContext;
}

/**
 * Creates page objects for a given Playwright Page instance.
 * This function can be reused by both Playwright fixtures and Cucumber world.
 */
export function createPages(page: Page): Pages {
  return {
    loginPage: new LoginPage(page),
    homePage: new HomePage(page),
    indexPasienPage: new IndexPasienPage(page),
    pendaftaranPage: new PendaftaranPage(page),
  };
}

// Extend playwright-bdd test with custom fixtures
export const test = bddTest.extend<{
  page: Page;
  pages: Pages;
  pageContext: PageContext;
  testContext: TestContext;
}>({
  page: async ({ browser }, use, testInfo) => {
    const storageStatePath = path.join(__dirname, "../../playwright/.auth/testuser1.json");

    // Check if this is a login scenario - don't use storage state for login tests
    const isLoginScenario = testInfo.titlePath.some(
      (path) => path.toLowerCase().includes("login") || testInfo.file?.includes("login.feature")
    );

    let context;
    if (isLoginScenario) {
      // Create context without storage state for login scenarios
      console.log("[FIXTURE] Skipping storage state for login scenario - starting fresh session");
      context = await browser.newContext();
    } else {
      // Verify storage state file exists for non-login scenarios
      if (!fs.existsSync(storageStatePath)) {
        throw new Error(`Storage state file not found at: ${storageStatePath}. Please run the auth setup first.`);
      }
      console.log("[FIXTURE] Using storage state for authenticated session");
      context = await browser.newContext({ storageState: storageStatePath });
    }

    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  pages: async ({ page }, use) => {
    const pages = createPages(page);
    await use(pages);
  },
  pageContext: async ({ page, pages }, use) => {
    const pageContext: PageContext = {
      page,
      pages,
    };
    await use(pageContext);
  },
  testContext: async ({}, use) => {
    const testContext: TestContext = {};
    await use(testContext);
  }
});
export { expect } from "@playwright/test";
