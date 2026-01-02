import { createBdd } from 'playwright-bdd';
import { SelectPuskesmasPage } from '../pages/selectFaskes/select.puskesmas.page';   

const { Given, When, Then } = createBdd();

When('user selects puskesmas', async ({ page }) => {
    const selectPuskesmasPage = new SelectPuskesmasPage(page);
    await selectPuskesmasPage.pilihPuskesmas();
})


