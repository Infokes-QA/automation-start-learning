import { Locator, Page, expect } from "@playwright/test";
import { normalizeUiText } from "../helpers/pendaftaran/PendaftaranHelperSupport";

export class IndexPasienPage {
    private readonly page: Page;

    //url pasien
    private readonly urlIndeksPasien = `${process.env.BASE_URL}/pasien?broadcastNotif=1`;

    //filter halaman
    private readonly dropdownLimitDataTabel = "select[name='limitPerPage']";
    private readonly dropdownFilterStatusDataPasien = "select[name='typeRecord']";
    private readonly dropdownFilterStatusVerifikasi = "select[name='typeVerification']";
    private readonly dropdownFilterStatusGeneralConsent = "#status_general_consent";
    private readonly filterTanggalLahir = "input[placeholder='Tanggal lahir']";
    private readonly kotakPencarian = "input[placeholder='Pencarian']";
    private readonly buttonCari = "button:has-text('Cari')";
    private readonly buttonResetFilter = "button:has-text('Reset')";

    //tabel data
    private readonly dataTableSearchResult = "table tbody tr:nth-child(1) td:nth-child(1)";
    private readonly dataTabel = "table tbody tr";
    private readonly checkbox = "tbody input[type='checkbox']";
    private readonly buttonHapus = "#button_delete";
    private readonly buttonHapusPermanen = "#button_destroy";
    private readonly buttonRestore = "#button_restore";

    //pesan pada index
    private readonly pesanPenghapusanData = "1 data berhasil dihapus!";
    private readonly pesanPenghapusanPermanenData = "1 data berhasil dihapus permanen!";

    constructor(page: Page) {
        this.page = page;
    }

    async navigasiKeMenuPasien(): Promise<void> {
        await this.page.goto(this.urlIndeksPasien);
    }

    async cariDataPasien(query: string): Promise<void> {
        await this.page.fill(this.kotakPencarian, query);
        await this.page.click(this.buttonCari);
        await this.tungguTabelDataTerupdate();
    }

    async setFilterStatusDataPasien(status: "Aktif" | "Dihapus" | "Semua"): Promise<void> {
        await this.page.locator(this.dropdownFilterStatusDataPasien).selectOption({ label: status });
    }

    async cariDataPasienBerdasarkanStatus(nik: string, status: "Aktif" | "Dihapus" | "Semua"): Promise<void> {
        await this.setFilterStatusDataPasien(status);
        await this.cariDataPasien(nik);
    }

    async tungguTabelDataTerupdate(): Promise<void> {
        await expect(this.page.locator(this.dataTabel).first()).toBeVisible();
    }

    async jumlahDataPadaTable(): Promise<number> {
        await this.tungguTabelDataTerupdate();
        return await this.page.locator(this.dataTabel).count();
    }

    async dataNikPasien(index: number): Promise<string> {
        const baris = this.page.locator(this.dataTabel);
        await baris.first().waitFor();
        const barisSpesifik = baris.nth(index);
        const dataNik = await barisSpesifik.locator('td:nth-child(6)').innerText();
        return dataNik.trim();
    }

    async dataNamaPasien(index: number): Promise<string> {
        const baris = this.page.locator(this.dataTabel);
        await baris.first().waitFor();
        const barisSpesifik = baris.nth(index);
        const dataNama = await barisSpesifik.locator('td:nth-child(5)').innerText();
        return dataNama;
    }

    async pilihDataPasien(): Promise<void> {
        await this.page.locator(this.checkbox).first().check();
    }

    async klikTombolHapus(): Promise<void> {
        await this.page.locator(this.buttonHapus).click();
    }

    async klikTombolHapusPermanen(): Promise<void> {
        await this.page.locator(this.buttonHapusPermanen).click();
    }

    async klikTombolKembalikan(): Promise<void> {
        await this.page.locator(this.buttonRestore).click();
    }

    async getPesanPenghapusanData() {
        return await this.page.getByText(this.pesanPenghapusanData).textContent();
    }

    async getPesanPenghapusanPermanenData() {
        return await this.page.getByText(this.pesanPenghapusanPermanenData).textContent();
    }

    async detailViewPasien(): Promise<void> {
        await this.page.dblclick(this.dataTableSearchResult);
    }

    nikCellByValue(nik: string): Locator {
        const escapedNik = nik.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return this.page
        .locator("table tbody tr td")
        .filter({ hasText: new RegExp(`^\\s*${escapedNik}\\s*$`) })
        .first();
    }

    async detailViewPasienByNik(nik: string): Promise<void> {
        const nikCell = this.nikCellByValue(nik).first();
        await Promise.all([this.page.waitForURL(/\/pasien\/show/), nikCell.dblclick()]);
    }

    async assertPasienListedByNik(nik: string): Promise<void> {
        const nikCell = this.nikCellByValue(nik).first();
        await expect(nikCell).toBeVisible();
        const nikCellText = await nikCell.textContent();
        expect(normalizeUiText(nikCellText)).toBe(normalizeUiText(nik));
    }
}