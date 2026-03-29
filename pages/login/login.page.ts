import { Locator, Page } from "@playwright/test";
import { BasePage, RetryOptions } from "../base.pages";

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly selectKlinik: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
        this.selectKlinik = page.locator('#nama-faskes');
    }

    async goto() {
        await this.page.goto('/login');
    }

    async actionSelectKlinik(klinik: string) {
        await this.selectKlinik.waitFor({ state: 'visible' });
        await this.selectKlinik.click();
        await this.selectKlinik.fill(klinik);
        await this.selectKlinik.press('ArrowDown');
        await this.page.waitForSelector('#ui-id-1', { state: 'visible' });
        await this.page.locator('ul#ui-id-1 > li.ui-menu-item').first().click();
        await this.page
        .waitForSelector('#ui-id-1', { state: 'hidden' })
        .catch(() => undefined);
    }

    async actionInputUsername(username: string) {
        await this.usernameInput.fill(username);
    }
    
    async actionInputPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async actionClickLogin() {
        await this.loginButton.click();
    }
}