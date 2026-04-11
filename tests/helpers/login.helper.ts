import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { env } from "../../config/env.config";

export class LoginHelper {

  static async goToLoginPage(loginPage: LoginPage): Promise<void> {
    await loginPage.mapsToLoginPage();
  }

  static async selectFacility(loginPage: LoginPage): Promise<void> {
    await loginPage.selectFacility(env.EC_FASKES);
  }

  static async enterUsername(loginPage: LoginPage): Promise<void> {
    await loginPage.enterUsername(env.EC_USERNAME);
  }

  static async enterPassword(loginPage: LoginPage): Promise<void> {
    await loginPage.enterPassword(env.EC_PASSWORD);
  }

  static async clickLoginButton(page: Page, loginPage: LoginPage): Promise<void> {
    await loginPage.clickLoginButton();
    await page.waitForLoadState("domcontentloaded");
  }

  static async loginUser(page: Page, loginPage: LoginPage): Promise<void> {
    await this.goToLoginPage(loginPage);
    await this.selectFacility(loginPage);
    await this.enterUsername(loginPage);
    await this.enterPassword(loginPage);
    await this.clickLoginButton(page, loginPage);
    await page.waitForURL(/^(?!.*\/login).*$/i, { timeout: 60_000 });
  }
}