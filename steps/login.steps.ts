import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/login/login.page';
import { SelectPuskesmasPage } from '../pages/login/select.puskesmas.page';


const { Given, When, Then } = createBdd();

Given('user navigates to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.kunjungiHalaman();
});

When('user enters valid username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const username = process.env.EC_USERNAME!;
    const password = process.env.EC_PASSWORD!;

    await loginPage.isikanIdPengguna(username);
    await loginPage.isikanKataSandi(password);
});

When('user clicks login button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.klikTombolLogin();
});

Then('user will be directed to the select puskesmas page', async ({ page }) => {
    const selectPuskesmasPage = new SelectPuskesmasPage(page);
    await selectPuskesmasPage.lihatJudulPuskesmas();
});

When('user selects puskesmas', async ({ page }) => {
    const selectPuskesmasPage = new SelectPuskesmasPage(page);
    await selectPuskesmasPage.pilihPuskesmas();
})