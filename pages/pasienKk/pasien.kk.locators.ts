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
    nikField: page.getByPlaceholder("Nomor Induk Kependudukan"),
    nameField: page.getByPlaceholder("NAMA LENGKAP"),   
    //genderField: page.getByRole("combobox", { name: "Jenis Kelamin" }),
    birthDateField: page.locator('#tanggal_lahir'),
    maleRadioButton: page.getByText("Laki-laki"),
    femaleRadioButton: page.getByText("Perempuan"),

    //form create pasien submit button
    submitButton: page.locator("#button_save")

});
