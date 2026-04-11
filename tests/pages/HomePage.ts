import { expect, Page } from "@playwright/test";
import { env } from "../../config/env.config";

export class HomePage {
  private page: Page;
  private readonly url = "/home";

  constructor(page: Page) {
    this.page = page;
  }

  async mapsToHomePage(): Promise<void> {
    await this.page.goto(`${env.BASE_URL}${this.url}`);
    await this.page.keyboard.press("Escape").catch(() => undefined);
  }
}