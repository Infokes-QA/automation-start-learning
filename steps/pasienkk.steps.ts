import { createBdd } from 'playwright-bdd';
import { PasienKkPage } from '../pages/pasienkk/pasien.kk.page';

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
