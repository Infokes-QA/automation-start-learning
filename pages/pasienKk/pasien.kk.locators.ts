import { Page } from "@playwright/test";

export const pasienKkLocators = (page: Page) => ({
    
    //filter page pasien kk
    searchNIK: page.getByPlaceholder("Cari NIK / No Asuransi"),

    //button page pasien kk
    buttonCari: page.getByRole("button", { name: "Cari" }),
    
    //pasien detail
    labelLihatDataPasien: page.getByText('Lihat Data Pasien', { exact: true }),
    labelLihatDataPendaftaran: page.getByText('Lihat Data Pendaftaran', { exact: true }),

    //data table pasien kk
    findSpecificTableRowUsingString: async (key: string) =>
        await page.getByRole("table").getByRole("row").filter({ hasText: key }),

    //button create pasien
    buttonCreatePasien: page.locator("#button_create"),

    //form create pasien
    nikField: page.locator('input[name="MPasien[nik]"]'),
    noKKField: page.locator('input[name="MPasien[no_kk]"]'),
    namaField: page.locator('input[name="MPasien[nama]"]').or(page.locator('input[name="nama"]')),
    jenisKelaminLaki: page.locator('input[name="MPasien[jenis_kelamin]"][value="L"]').or(page.locator('input[name="jenis_kelamin"][value="L"]')).or(page.locator('input[name="MPasien[jenis_kelamin]"][value="1"]')),
    jenisKelaminPerempuan: page.locator('input[name="MPasien[jenis_kelamin]"][value="P"]').or(page.locator('input[name="jenis_kelamin"][value="P"]')).or(page.locator('input[name="MPasien[jenis_kelamin]"][value="2"]')),
    submitButton: page.locator('#button_save'),
});
