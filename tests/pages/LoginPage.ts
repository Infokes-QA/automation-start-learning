import { Locator, Page, expect } from "@playwright/test";
import { env } from "../../config/env.config";

export class LoginPage {
  private readonly page: Page;
  private readonly facilityInput = "#nama-faskes";
  private readonly usernameInput = "#email";
  private readonly passwordInput = "#password";
  private readonly loginButton = "#login";
  private readonly loginUrl: string;
  private readonly facilitySelectionButton: string;

  private readonly autocompleteList = "#ui-id-1";
  private readonly autocompleteItem = "ul#ui-id-1 > li.ui-menu-item";

  constructor(page: Page) {
    this.page = page;
    this.loginUrl = `${env.BASE_URL}/login`;
    this.facilitySelectionButton = `span:has-text('${env.EC_FASKES}')`;
  }

  async mapsToLoginPage(): Promise<void> {
    await this.page.goto(this.loginUrl);
    await expect(this.page.locator(this.loginButton)).toBeVisible();
  }

  async selectFacility(namaFaskes: string): Promise<void> {
    await this.page.fill(this.facilityInput, namaFaskes);
    await this.page.press(this.facilityInput, 'ArrowDown');
    await this.page.waitForSelector(this.autocompleteList, { state: 'visible' });
    await this.page.locator(this.autocompleteItem).first().click();
    
    await this.page
      .waitForSelector(this.autocompleteList, { state: 'hidden' })
      .catch(() => undefined);
  }

  async enterUsername(idPengguna: string): Promise<void> {
    await this.page.fill(this.usernameInput, idPengguna);
  }

  async enterPassword(kataSandi: string): Promise<void> {
    await this.page.fill(this.passwordInput, kataSandi);
  }

  async clickLoginButton(): Promise<void> {
    await this.page.click(this.loginButton);
    await this.page.waitForLoadState("domcontentloaded");
  }

  getSubmitButton(): Locator {
    return this.page.locator(this.loginButton);
}
}