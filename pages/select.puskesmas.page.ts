import { Page, Locator } from "@playwright/test";

export class SelectPuskesmasPage {
    readonly page: Page;
    readonly puskesmasButton: Locator;
    readonly pustuButton: Locator;
    readonly poskesdesButton: Locator;
    readonly puskesmasTitle: Locator;
    readonly pustuTitle: Locator;
    readonly poskesdesTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.puskesmasButton = page.getByRole("button", { name: /puskesmas/i });
        this.pustuButton = page.getByRole("button", { name: /pustu/i });
        this.poskesdesButton = page.getByRole("button", { name: /poskesdes/i });
        this.puskesmasTitle = page.getByText("Puskesmas");
        this.pustuTitle = page.getByText("Pustu");
        this.poskesdesTitle = page.getByText("Poskesdes");
    }   

    async pilihPuskesmas() {
        await this.puskesmasButton.click();
    }
    async pilihPustu() {
        await this.pustuButton.click();
    }
    async pilihPoskesdes() {
        await this.poskesdesButton.click();
    }
    async lihatJudulPuskesmas() {
        await this.puskesmasTitle.isVisible();
    }
    async lihatJudulPustu() {
        await this.pustuTitle.isVisible();
    }
    async lihatJudulPoskesdes() {
        await this.poskesdesTitle.isVisible();
    }
}
