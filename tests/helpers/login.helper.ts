import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { env } from "../../config/env.config";

/**
 * Helper functions for login-related test steps
 * Converted from Cucumber step definitions to reusable TypeScript functions
 */
export class LoginHelper {
  /**
   * Navigate to login page
   * Equivalent to: Given('user navigates to login page')
   */
  static async navigateToLoginPage(loginPage: LoginPage): Promise<void> {
    await loginPage.kunjungiHalaman();
  }

  /**
  * Select facility and complete login
  * Equivalent to: Then('user should be redirected to the dashboard page')
  */
  static async selectFacility(loginPage: LoginPage): Promise<void> {
    await loginPage.pilihFaskes(env.EC_FASKES);
  }

  /**
   * Enter username from environment variable
   * Equivalent to: When('user enters {string} as username')
   */
  static async enterUsername(loginPage: LoginPage): Promise<void> {
    await loginPage.isiIdPengguna(env.EC_USERNAME);
  }

  /**
   * Enter password from environment variable
   * Equivalent to: When('user enters {string} as password')
   */
  static async enterPassword(loginPage: LoginPage): Promise<void> {
    await loginPage.isiKataSandi(env.EC_PASSWORD);
  }

  /**
   * Click login button
   * Equivalent to: Then('user clicks the login button')
   */
  static async clickLoginButton(page: Page, loginPage: LoginPage): Promise<void> {
    await loginPage.klikTombolLogin();
    await page.waitForLoadState("domcontentloaded");
  }

  /**
   * Complete login flow: navigate, enter credentials, login, and select facility
   * Equivalent to: Given('the user is logged in')
   */
  static async loginUser(page: Page, loginPage: LoginPage): Promise<void> {
    await this.navigateToLoginPage(loginPage);
    await this.selectFacility(loginPage);
    await this.enterUsername(loginPage);
    await this.enterPassword(loginPage);
    await this.clickLoginButton(page, loginPage);
    await page.waitForURL(/^(?!.*\/login).*$/i, { timeout: 60_000 });
  }
}