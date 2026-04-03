import { createBdd } from 'playwright-bdd';
import { PasienKkPage } from '../pages/pasienKk/pasien.kk.page';
import { createPasienLakiLaki, createPasienPerempuan } from '../data/pasien.data';

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
    await pasienKkPage.expectUrl("/pasien/create");
});

When('user fill create pasien form with {string} data', async ({ page }, jenisKelamin) => {
    const pasienKkPage = new PasienKkPage(page);
    const data = jenisKelamin === 'Laki-laki' ? createPasienLakiLaki() : createPasienPerempuan();
    await pasienKkPage.fillFormPasien(data);
});

Then('user should see success message', async ({ page }) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.expectUrl(/\/pasien\/(show|\?)?/);
});


