import { chromium, type FullConfig } from "@playwright/test";
import path from "path";
import * as fs from "fs";
import { LoginPage } from "../pages/LoginPage";
import { LoginHelper } from "../helpers/login.helper";
import { env } from "../../config/env.config";

async function globalSetup(_config: FullConfig): Promise<void> {
  if (!env.EC_USERNAME || !env.EC_PASSWORD || !env.EC_FASKES) {
    throw new Error(
      "Missing auth env vars. Please set EC_USERNAME, EC_PASSWORD, and EC_FASKES in your environment.",
    );
  }

  const storageStatePath = path.join(__dirname, "../../playwright/.auth/user.json");
  fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });

  // Always run setup headless and outside of test report.
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPage(page);
  await LoginHelper.loginUser(page, loginPage);
  await context.storageState({ path: storageStatePath });

  await context.close();
  await browser.close();
}

export default globalSetup;

