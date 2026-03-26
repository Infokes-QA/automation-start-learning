import { test, expect } from "@playwright/test";
import path from "path";
import * as fs from "fs";
import { LoginPage } from "../pages/LoginPage";
import { LoginHelper } from "../helpers/login.helper";
import { env } from "../../config/env.config";

/**
 * Runs in the Playwright `setup` project before BDD/chromium tests.
 * Writes storage state consumed by `tests/fixtures/pages.fixture.ts`.
 */
test("auth setup - create storage state", async ({ browser }) => {
  if (!env.EC_USERNAME || !env.EC_PASSWORD || !env.EC_FASKES) {
    throw new Error(
      "Missing auth env vars. Please set EC_USERNAME, EC_PASSWORD, and EC_FASKES in your environment.",
    );
  }

  const storageStatePath = path.join(__dirname, "../../playwright/.auth/testuser1.json");
  fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });

  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  await LoginHelper.loginUser(page, loginPage);
  await expect(page).not.toHaveURL(/\/login(\?|$)/);

  await context.storageState({ path: storageStatePath });
  await context.close();
});
