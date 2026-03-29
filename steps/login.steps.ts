import { createBdd } from "playwright-bdd";
import { LoginPage } from "../pages/login/login.page";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

let loginPage: LoginPage;

Given("User navigates to Login page", async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
});

When("User logs in with valid credentials", async () => {
    await loginPage.actionSelectKlinik(process.env.EC_FASKES!);
    await loginPage.actionInputUsername(process.env.EC_USERNAME!);
    await loginPage.actionInputPassword(process.env.EC_PASSWORD!);
    await loginPage.actionClickLogin();
});

Then('User will be directed to the home page', async ({ page }) => {
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/home/);
});