import type { Locator, Page } from "@playwright/test";
import { BasePage } from "../base.pages";

export class SelectPuskesmasPage extends BasePage {
    readonly puskesmasButton: Locator;
    readonly pustuButton: Locator;
    readonly poskesdesButton: Locator;
    readonly selectFaskesIndicator: Locator;

    constructor(page: Page) {
        super(page);
        // Scope to the main content area to avoid matching the top-nav user button
        // (e.g. "arif.qa PUSKESMAS PUSKESMAS 20").
        const content = this.page.locator('#content');
        this.puskesmasButton = content.getByRole("button", { name: /puskesmas/i }).first();
        this.pustuButton = content.getByRole("button", { name: /pustu/i }).first();
        this.poskesdesButton = content.getByRole("button", { name: /poskesdes/i }).first();

        // POSKESDES is a good unique signal for the select-faskes page.
        this.selectFaskesIndicator = this.pustuButton;
    }   

    async pilihPuskesmas() {
        await this.click(this.puskesmasButton);
    }
    async pilihPustu() {
        await this.click(this.pustuButton);
    }
    async pilihPoskesdes() {
        await this.click(this.poskesdesButton);
    }
    async lihatJudulPuskesmas() {
        await this.waitVisible(this.selectFaskesIndicator);
    }
    async lihatJudulPustu() {
        await this.waitVisible(this.pustuButton);
    }
    async lihatJudulPoskesdes() {
        await this.waitVisible(this.poskesdesButton);
    }

    async pilihPuskesmasJikaMuncul() {
        const onSelectPage = await this.tryWaitVisible(this.selectFaskesIndicator, 2000);
        if (onSelectPage) {
            await this.pilihPuskesmas();
        }
    }
}
