import { createBdd } from 'playwright-bdd';
import type { Page } from '@playwright/test';
import { createPatientData, type PatientData, type PatientProfile } from '../data/pasien.data';
import { PasienKkPage } from '../pages/pasienkk/pasien.kk.page';

const { Given, When, Then } = createBdd();
const patientDataStore = new WeakMap<Page, PatientData>();

function resolvePatientProfile(profile: string): PatientProfile {
    if (profile === 'laki-laki' || profile === 'perempuan') {
        return profile;
    }

    throw new Error(`Patient profile "${profile}" is not registered.`);
}

function saveGeneratedPatientData(page: Page, patientData: PatientData) {
    patientDataStore.set(page, patientData);
}

function getGeneratedPatientData(page: Page) {
    const patientData = patientDataStore.get(page);

    if (!patientData) {
        throw new Error('Patient data has not been generated for this scenario.');
    }

    return patientData;
}

Given('user in pendaftaran pasien & kk page', async ({ page }) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.bukaHalamanPasienKk();
});

When('user search patient asuransi umum with {string}', async ({ page }, nik) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.isiNIKPasien(nik);
    await pasienKkPage.klikTombolCari();
});

When('user create new patient asuransi umum {string}', async ({ page }, profile) => {
    const pasienKkPage = new PasienKkPage(page);
    const patientData = createPatientData(resolvePatientProfile(profile));

    saveGeneratedPatientData(page, patientData);

    await pasienKkPage.klikBuatBaru();
    await pasienKkPage.isiFormPasienBaru(patientData);
    await pasienKkPage.simpanPasienBaru();
});

Then('user can see registered {string} pasien data in table', async ({ page }, profile) => {
    const pasienKkPage = new PasienKkPage(page);
    resolvePatientProfile(profile);
    const patientData = getGeneratedPatientData(page);

    await pasienKkPage.verifikasiDataPasienTerdaftar(patientData);
});

Then('user can see {string} pasien nama in table', async ({ page }, namaPasien) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.verifikasiNamaPasienTerlihat(namaPasien);
});

Then('user can see {string} pasien nik in table', async ({ page }, nikPasien) => {
    const pasienKkPage = new PasienKkPage(page);
    await pasienKkPage.verifikasiNIKPasienTerlihat(nikPasien);
});
