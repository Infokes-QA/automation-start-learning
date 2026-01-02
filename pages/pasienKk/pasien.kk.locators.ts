import { Page } from "@playwright/test";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const pasienKkLocators = (page: Page) => ({
    
    //filter page pasien kk
    searchNama: page.getByPlaceholder("Cari Namae"),
    searchNIK: page.getByPlaceholder("Cari NIK"),
    //detail view pasien kk
    penjaminPasien: page.getByText("Penjamin" ),
    jenisKelamin: page.getByText("Jenis Kelamin"),
    //button page pasien kk
    buttonCari: page.getByRole("button", { name: "Cari" }),
    buttonReset: page.getByRole("button", { name: "Reset" }),
    buttonBuatBaru: page.locator('#button_create'),
    buttonPendaftaran: page.locator('#button_next'),
    //pasien detail
    labelLihatDataPasien: page.getByText('Lihat Data Pasien', { exact: true }),
    labelLihatDataPendaftaran: page.getByText('Lihat Data Pendaftaran', { exact: true }),
    // mau nangis ini dropdown hapus nya beda di detail pasien sama di pendaftaran pasien :'(
    dropDownHapusButton: page.getByRole('button', { name: 'Toggle Dropup' }).first(),
    buttonHapusSemuaPemeriksaan: page
        .getByRole('button', { name: /Hapus\s+Semua\s+Pemeriksaan/i })
        .or(page.getByRole('link', { name: /Hapus\s+Semua\s+Pemeriksaan/i }))
        .or(page.getByRole('menuitem', { name: /Hapus\s+Semua\s+Pemeriksaan/i })),
    buttonHapusPermanen: page
        .getByRole('button', { name: /Hapus\s+Permanen/i })
        .or(page.getByRole('link', { name: /Hapus\s+Permanen/i }))
        .or(page.getByRole('menuitem', { name: /Hapus\s+Permanen/i })),
    textBoxOtorisasiHapus: page.getByPlaceholder(/Password\s+Otorisasi/i),
    textBoxKeteranganHapus: page.getByPlaceholder('Keterangan'),
    buttonConfirmHapusSemuaPemeriksaan: page.getByRole('button', { name: /Hapus Semua Pemeriksaan/i }),
    passwordOtorisasiInput: page.locator('input[placeholder="Password Otorisasi"]:visible'),
    passwordOtorisasiInputAny: page.locator('input[placeholder="Password Otorisasi"]'),
    deletionDialog: page.getByRole('dialog').filter({ has: page.locator('input[placeholder="Password Otorisasi"]') }),
    bulkHapusButton: page
        .locator('table')
        .locator('tr')
        .filter({ hasText: /^\s*Hapus\s*$/i })
        .getByRole('button', { name: /^Hapus$/i }),
    keteranganHapusInput: page.locator('input[placeholder="Keterangan"]:visible, textarea[placeholder="Keterangan"]:visible'),

    // CKG banner (often appears on Kunjungan Sehat)
    ckgCheckbox: page.getByLabel(/Tandai sebagai pelayanan CKG/i),
    //form create pasien
    checkboxVerifikasiLengkap: page.getByLabel("Diverifikasi (lengkap)"),
    fieldNIK: page.getByPlaceholder("Nomor Induk Kependudukan"),
    fieldNama: page.getByPlaceholder("Nama Lengkap"),
    dropdownStatusKeluarga: page.getByLabel("Status di Kartu Keluarga"),
    selectStatusKeluarga: async (statusChoice: string) =>
        await page.getByLabel("Status di Kartu Keluarga").selectOption(statusChoice),
    radioKelaminLaki: page.getByLabel("Laki-laki"),
    radioKelaminPerempuan: page.getByLabel("Perempuan"),
    fieldTanggalLahir: page.getByPlaceholder("dd-mm-yyyy"),
    fieldTempatLahir: page.getByPlaceholder("Kota Lahir"),
    fieldNoHP: page.getByPlaceholder("Nomor Handphone/Telpon"),
    fieldPropinsi: page.getByPlaceholder("🔍 Nama Propinsi"),
    fieldKotaKab: page.getByPlaceholder("🔍 Nama Kota/Kabupaten"),
    fieldKecamatan: page.getByPlaceholder("🔍 Nama Kecamatan"),
    fieldKelurahan: page.getByPlaceholder("🔍 Nama Kelurahan"),
    fieldAlamat: page.getByPlaceholder("Alamat Lengkap"),
    fieldRT: page.locator("[name='MPasien[rt]']"),
    fieldRW: page.locator("[name='MPasien[rw]']"),
    fieldPekerjaan: page.getByPlaceholder("🔍 Pekerjaan"),
    selectAgama: async (agamaChoice: string) =>
        await page.getByLabel("Agama").selectOption(agamaChoice),
    selectPendidikan: async (pendidikanChoice: string) =>
        await page.getByLabel("Pendidikan").selectOption(pendidikanChoice),
    selectStatusKawin: async (statusKawinChoice: string) =>
        await page.getByLabel("Status Perkawinan").selectOption(statusKawinChoice),
    selectWargaNegara: async (wargaNegaraChoice: string) =>
        await page.getByLabel("Warga Negara").selectOption(wargaNegaraChoice),
    nikCell: 'table tbody tr >> nth=0 >> td >> nth=5',
    nikDetailPasien: 'label:has-text("NIK") + div',
    dataPasienPendaftaran: 'label#data_pasien',

    //tombol page pasien kk
    buttonSimpan: page.locator("#button_save"),
    buttonResetForm: page.locator("#button_reset"),

    //data table pasien kk
    findSpecificTableRowUsingString: async (key: string) =>
        await page.getByRole("table").getByRole("row").filter({ hasText: key }),
    
    //Form Buat Baru Pendaftaran
    radioStatusKunjungan: (kunjungan: string) => page.getByLabel(kunjungan),
    asuransiCombobox: page.getByText(/Asuransi\s*\*/).locator('..').getByRole('combobox'),
    bpjsNumberField: page.getByPlaceholder("🔍 No. Kartu Peserta"),
    buttonBridgingBPJS: page.locator('#button_bridgingbpjs'),
    buttonValidateBPJS: page.locator('#button_validate_bpjs'),
    tinggiBadanField: page.getByText(/Tinggi\s*Badan\s*\*/).locator('..').getByRole('spinbutton').first(),
    beratBadanField: page.getByText(/Berat\s*Badan\s*\*/).locator('..').getByRole('spinbutton').first(),
    instalasiButton: (instalasiChoice: string) =>
        page
            .getByText(/Instalasi\s*\*/)
            .locator('..')
            .getByRole('button')
            .filter({ hasText: new RegExp(escapeRegExp(instalasiChoice), 'i') })
            .first(),
    poliButton: (poliChoice: string) =>
        page
            .getByText(/Poli\s*\/\s*Ruangan\s*\*/)
            .locator('..')
            .getByRole('button')
            .filter({ hasText: new RegExp(escapeRegExp(poliChoice), 'i') })
            .first(),
    kamarButton: (kamarChoice: string) =>
        page
            .getByText(/Kamar\s*\*/)
            .locator('..')
            .getByRole('button')
            .filter({ hasText: new RegExp(escapeRegExp(kamarChoice), 'i') })
            .first(),
    bedButton: (bedChoice: string) =>
        page
            .getByText(/Bed\s*\*/)
            .locator('..')
            .getByRole('button')
            .filter({ hasText: new RegExp(escapeRegExp(bedChoice), 'i') })
            .first(),
    jadwalDokterButton: (jadwalChoice: string) => page.getByRole('button').filter({ hasText: jadwalChoice }).first(),
    generalAlertMessage: page.locator('[data-notify="container"].alert-success'),
    phoneNumberfield:page.getByPlaceholder("Nomor Handphone/Telpon Pasien"),
    textBerhasilTerkirimBPJS: page.getByText(/Berhasil\s+Terkirim\s+ke\s+Antrean\s+Online\s+BPJS/i),

    
});
