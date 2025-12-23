import { Page, Locator } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly kolomIdPengguna: Locator;
    readonly kolomKataSandi: Locator;
    readonly tombolLogin: Locator;
    

    constructor(page: Page) {
        this.page = page;
        this.kolomIdPengguna = page.getByPlaceholder("E-mail / No. HP / ID");
        this.kolomKataSandi = page.getByPlaceholder("kata kunci");
        this.tombolLogin = page.getByRole("button", { name: "Login" });
    }

    async kunjungiHalaman() {
        await this.page.goto("/login");
    }

    async isikanIdPengguna(idPengguna: string) {
        await this.kolomIdPengguna.fill(idPengguna);
    }
    async isikanKataSandi(kataSandi: string) { 
        await this.kolomKataSandi.fill(kataSandi);
    }
    async klikTombolLogin() {
        await this.tombolLogin.click();
    }
    
    
}