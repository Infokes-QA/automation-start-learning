import type { Page } from "@playwright/test";
import { BasePage } from "../base.pages";
import { pasienKkLocators } from "./pasien.kk.locators";

export class PasienKkPage extends BasePage {
    readonly element: ReturnType<typeof pasienKkLocators>;
    constructor(page: Page) {
        super(page);
        this.element = pasienKkLocators(page);
    }
    
    async bukaHalamanPasienKk() {
        await this.goto("/pasien");
    }

    async isiNIKPasien(nik: string) {
        await this.fill(this.element.searchNIK, nik);
    }

    async klikTombolCari() {
        await this.click(this.element.buttonCari);
    }

    async verifikasiNamaDiTabel(namaPasien: string) {
        const row = await this.element.findSpecificTableRowUsingString(namaPasien);
        await this.waitVisible(row);
    }

    async verifikasiNIKDiTabel(nikPasien: string) {
        const row = await this.element.findSpecificTableRowUsingString(nikPasien);
        await this.waitVisible(row);
    }

    
}