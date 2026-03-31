import type { Locator, Page } from "@playwright/test";
import { BasePage } from "../base.pages";

export class HomePage extends BasePage {
    readonly dashboardTitle: Locator;
    readonly dropDownMenuPendaftaran: Locator;
    readonly menuPendaftaranPasien: Locator;

    constructor(page: Page) {
        super(page);
        this.dashboardTitle = this.page.getByText("Dashboard Utama");
        this.dropDownMenuPendaftaran = this.page.locator("#menu_pendaftaran");
        this.menuPendaftaranPasien = this.page.locator("#menu_pendaftaran_pasien");
    }

    async lihatJudulDashboard() {
        await this.waitVisible(this.dashboardTitle);
    }

    async bukaDropdownPendaftaran() {
        await this.click(this.dropDownMenuPendaftaran);
    }

    async bukaMenuPendaftaranPasien() {
        await this.click(this.menuPendaftaranPasien);
    }

}