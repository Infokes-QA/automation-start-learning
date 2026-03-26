import { createBdd } from "playwright-bdd";
import { LoginHelper } from "../helpers/login.helper";
import { expect } from "@playwright/test";
import { test } from "../fixtures/pages.fixture";

const { Given, When, Then } = createBdd(test);

/** Rehydrates an authenticated session by visiting the home page after fixture setup. */
Given("the User is logged in", async ({ pages, page }) => {
  // Session storage is already loaded in fixture
  // Just navigate to home page to ensure we're authenticated
  await pages.homePage.gotoHome();
  await page.waitForTimeout(1000);
});

/** Opens the login page before credential entry steps run. */
Given("user navigates to login page", async ({ pages, page }) => {
  await LoginHelper.navigateToLoginPage(pages.loginPage);
  await expect(page).toHaveURL(/\/login/);
});

/** Opens the login page before credential entry steps run. */
When("user selects {string} as facility", async ({ pages }) => {
  await LoginHelper.selectFacility(pages.loginPage);
});

/** Fills the username field from environment-backed test credentials. */
When("user enters {string} as username", async ({ pages }, _usernameType: string) => {
  // The "env" string indicates to use environment variable
  await LoginHelper.enterUsername(pages.loginPage);
});

/** Fills the password field from environment-backed test credentials. */
When("user enters {string} as password", async ({ pages }, _passwordType: string) => {
  // The "env" string indicates to use environment variable
  await LoginHelper.enterPassword(pages.loginPage);
});

/** Submits the login form. */
Then("user clicks the login button", async ({ page, pages }) => {
  await LoginHelper.clickLoginButton(page, pages.loginPage);
});

/** Completes facility selection and confirms the user left the login page. */
Then("user should be redirected to the dashboard page", async ({ page }) => {
  await expect(page).not.toHaveURL(/\/login/);
});

/** Opens the Pasien page after a successful login. */
Then("user navigates to the Pasien page", async ({ pages }) => {
  await pages.homePage.gotoMenuPasien();
});
