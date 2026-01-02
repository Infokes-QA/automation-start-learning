import type { Locator, Page } from "@playwright/test";
import { BasePage } from "../base.pages";

export class LoginPage extends BasePage {
    readonly kolomIdPengguna: Locator;
    readonly kolomKataSandi: Locator;
    readonly tombolLogin: Locator;
    
    constructor(page: Page) {
        super(page);
        this.kolomIdPengguna = this.page.getByPlaceholder("E-mail / No. HP / ID");
        this.kolomKataSandi = this.page.getByPlaceholder("kata kunci");
        this.tombolLogin = this.page.getByRole("button", { name: "Login" });
    }

    async kunjungiHalaman() {
        await this.goto("/login");
    }

    async isikanIdPengguna(idPengguna: string) {
        await this.fill(this.kolomIdPengguna, idPengguna);
    }
    async isikanKataSandi(kataSandi: string) { 
        await this.fill(this.kolomKataSandi, kataSandi);
    }
    async klikTombolLogin() {
        await this.click(this.tombolLogin);
    }
    
    
}