import { expect, Page } from "@playwright/test";
import { env } from "../../config/env.config";

export class HomePage {
  private page: Page;
  private readonly url = "/home";
  private readonly menuPendaftaran = "a[id='menu_pendaftaran']";
  private readonly submenuPasien = "#menu_pendaftaran_pasien";
  private readonly submenuPendaftaranPasien = "#menu_pendaftaran_pendaftaran_v2";

  constructor(page: Page) {
    this.page = page;
  }

  attachPage(page: Page): void {
    this.page = page;
  }

  getActivePage(): Page {
    return this.page;
  }

  async gotoHome(): Promise<void> {
    await this.page.goto(`${env.BASE_URL}${this.url}`);
    await this.page.keyboard.press("Escape").catch(() => undefined);
    await expect(this.page).toHaveURL(/\/home/);
  }

  async gotoMenuPasien(): Promise<void> {
    await this.page.click(this.menuPendaftaran);
    await this.page.click(this.submenuPasien);
    await this.page.waitForURL(/\/pasien/i);
  }

  async gotoPendaftaranPasien(): Promise<void> {
    await this.page.click(this.menuPendaftaran);
    await this.page.click(this.submenuPendaftaranPasien);
    await this.page.waitForURL(/\/pendaftaran\/v2/i);
  }
}