import { createBdd } from 'playwright-bdd';
import { HomePage } from '../pages/home/home.page';
import { SelectPuskesmasPage } from '../pages/selectFaskes/select.puskesmas.page';

const { Given, When, Then } = createBdd();

Then('user will be directed to the home page', async ({ page }) => {
    const selectPage = new SelectPuskesmasPage(page);
    await selectPage.pilihPuskesmasJikaMuncul();

    const homePage = new HomePage(page);
    await homePage.lihatJudulDashboard();
});