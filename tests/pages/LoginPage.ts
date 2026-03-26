import { Locator, Page, expect } from "@playwright/test";
import { env } from "../../config/env.config";

/** Models the login form and authenticated landing checks for EClinic sessions. */
export class LoginPage {
  private readonly page: Page;
  private readonly kolomNamaFaskes = "#nama-faskes";
  private readonly kolomIdPengguna = "#email";
  private readonly kolomKataSandi = "#password";
  private readonly tombolLogin = "#login";
  private readonly loginUrl: string;
  private readonly faskesButton: string;

  constructor(page: Page) {
    this.page = page;
    this.loginUrl = `${env.BASE_URL}/login`;
    this.faskesButton = `span:has-text('${env.EC_FASKES}')`;
  }

  async kunjungiHalaman(): Promise<void> {
    await this.page.goto(this.loginUrl);
    await expect(this.page.locator(this.tombolLogin)).toBeVisible();
  }

  async pilihFaskes(namaFaskes: string): Promise<void> {
    await this.page.fill(this.kolomNamaFaskes, namaFaskes);
    await this.page.press(this.kolomNamaFaskes, 'ArrowDown');
    await this.page.waitForSelector('#ui-id-1', { state: 'visible' });
    await this.page.locator('ul#ui-id-1 > li.ui-menu-item').first().click();
    await this.page
      .waitForSelector('#ui-id-1', { state: 'hidden' })
      .catch(() => undefined);
  }

  async isiIdPengguna(idPengguna: string): Promise<void> {
    await this.page.fill(this.kolomIdPengguna, idPengguna);
  }

  async isiKataSandi(kataSandi: string): Promise<void> {
    await this.page.fill(this.kolomKataSandi, kataSandi);
  }

  async klikTombolLogin(): Promise<void> {
    await this.page.click(this.tombolLogin);
    await this.page.waitForLoadState("domcontentloaded");
  }

  loginButton(): Locator {
    return this.page.locator(this.tombolLogin);
  }

  facilityButton(): Locator {
    return this.page.locator(this.faskesButton);
  }
}