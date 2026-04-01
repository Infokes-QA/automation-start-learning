import { Page } from "@playwright/test";
import type { PatientData } from "../../data/pasien.data";

export const pasienKkLocators = (page: Page) => ({
    
    //filter page pasien kk
    searchNIK: page.getByPlaceholder("Cari NIK / No Asuransi"),

    //button page pasien kk
    buttonCari: page.getByRole("button", { name: "Cari" }),
    linkBuatBaru: page.getByRole("link", { name: "Buat Baru" }),
    
    //pasien detail
    labelLihatDataPasien: page.getByText('Lihat Data Pasien', { exact: true }),
    labelLihatDataPendaftaran: page.getByText('Lihat Data Pendaftaran', { exact: true }),

    inputNIKBaru: page.getByPlaceholder("Nomor Induk Kependudukan"),
    inputNamaLengkap: page.getByRole("textbox", { name: "Nama Lengkap" }),
    inputUmurTahun: page.locator("#umur_tahun"),
    inputUmurBulan: page.locator("#umur_bulan"),
    inputUmurHari: page.locator("#umur_hari"),
    inputNomorHp: page.getByPlaceholder("Nomor Handphone/Telpon"),
    buttonSimpan: page.locator("#button_save"),
    genderOption: (gender: string) => page.getByText(gender, { exact: true }),

    findElementUsingText: (key: string) =>
        page.locator('*').filter({ hasText: key }).first(),

    findElementUsingPatientData: (patientData: PatientData) =>
        page.locator('*')
            .filter({ hasText: patientData.nama })
            .filter({ hasText: patientData.nik })
            .first(),

    
});
