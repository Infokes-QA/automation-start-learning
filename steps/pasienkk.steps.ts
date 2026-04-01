import { createBdd } from 'playwright-bdd';
import { PasienKkPage } from '../pages/pasienkk/pasien.kk.page';
import { expect } from '@playwright/test';
import { PASIEN_DEFAULT } from '../data/pasien.data';
import { PASIEN_DEFAULT_Perempuan } from '../data/pasien.data';

const { Given, When, Then } = createBdd();

Given('user in pendaftaran pasien & kk page', async ({ page }) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.bukaHalamanPasienKk();
});

When('user search patient asuransi umum with {string}', async ({ page }, nik) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.isiNIKPasien(nik);
    await pasienKkPage.klikTombolCari();
});

Then('user can see {string} pasien nama in table', async ({ page }, namaPasien) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.verifikasiNamaDiTabel(namaPasien);
});

Then('user can see {string} pasien nik in table', async ({ page }, nikPasien) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.verifikasiNIKDiTabel(nikPasien);
});

When('user navigates to create pasien page', async ({ page }) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.navigatesToCreatePasienPage();
});

Then('user will be directed to create pasien page', async ({ page }) => {
    const pasienKkPage = new PasienKkPage(page);
    await expect(page).toHaveURL("/pasien/create");
    //await pasienKkPage.expectUrl("/pasien/create");
}); 

When ('user fill create pasien form with valid data', async ({ page }) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.fillFormPasien(PASIEN_DEFAULT);
});

When ('user save create pasien form', async ({ page }) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.saveNewPasien();
});

When ('user fill create pasien form with valid data perempuan', async ({ page }) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.fillFormPasien(PASIEN_DEFAULT_Perempuan);
});

Then ('sistem will show a pop-up success', async ({ page }) => {
    const pasienKkPage = new PasienKkPage(page);
    await expect(page.getByRole('alert')).toContainText('Data berhasil disimpan dengan ID');
});