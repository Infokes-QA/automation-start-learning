import { createBdd } from "playwright-bdd";
import { LoginHelper } from "../helpers/login.helper";
import { HomePageHelper } from "../helpers/homepage.helper";
import { expect } from "@playwright/test";
import { test } from "../fixtures/pages.fixture";

const { Given, When, Then } = createBdd(test);

Given("the user is logged in to eClinic", async ({ pages, page }) => {
  await HomePageHelper.mapsToHomePage(pages.homePage);
  await expect(page).toHaveURL(/\/home/);
});

Given("user navigates to login page", async ({ pages, page }) => {
  await LoginHelper.goToLoginPage(pages.loginPage);
  await expect(page).toHaveURL(/\/login/);
  const loginButton = pages.loginPage.getSubmitButton();
  await expect(loginButton).toBeVisible();
});

When("user selects {string} as facility", async ({ pages }) => {
  await LoginHelper.selectFacility(pages.loginPage);
});

When("user enters {string} as username", async ({ pages }, _usernameType: string) => {
  await LoginHelper.enterUsername(pages.loginPage);
});

When("user enters {string} as password", async ({ pages }, _passwordType: string) => {
  await LoginHelper.enterPassword(pages.loginPage);
});

When("user clicks the login button", async ({ page, pages }) => {
  await LoginHelper.clickLoginButton(page, pages.loginPage);
});

Then("user should be redirected to the dashboard page", async ({ page }) => {
  await expect(page).not.toHaveURL(/\/login/);
});
