import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/login.page';
import { SelectPuskesmasPage } from '../pages/select.puskesmas.page';
import { users } from '../data/users';

const { Given, When, Then } = createBdd();

Given('user navigates to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.kunjungiHalaman();
});

When('user enters {string} username and password', async ({ page }, key: string) => {
    const loginPage = new LoginPage(page);
    const data = (users as any)[key];
    await loginPage.isikanIdPengguna(data.username);
    await loginPage.isikanKataSandi(data.password);
});

When('user clicks login button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.klikTombolLogin();
});

Then('user will be directed to the select puskesmas page', async ({ page }) => {
    const selectPuskesmasPage = new SelectPuskesmasPage(page);
    await selectPuskesmasPage.lihatJudulPuskesmas();
});
