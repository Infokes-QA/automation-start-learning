import { Locator, Page, expect } from "@playwright/test";

export class IndexPasienPage {
    private readonly page: Page;

    private readonly patientIndexUrl = `${process.env.BASE_URL}/pasien?broadcastNotif=1`;
    private readonly statusFilterDropdown = "select[name='typeRecord']";
    private readonly searchInput = "input[placeholder='Pencarian']";
    private readonly searchButton = "button:has-text('Cari')";
    private readonly dataTableSearchResult = "table tbody tr:nth-child(1) td:nth-child(1)";
    private readonly tableRows = "table tbody tr";
    private readonly checkbox = "tbody input[type='checkbox']";
    private readonly deleteButton = "#button_delete";
    private readonly permanentDeleteButton = "#button_destroy";
    private readonly restoreButton = "#button_restore";
    private readonly deleteSuccessMessage = "1 data berhasil dihapus!";
    private readonly permanentDeleteSuccessMessage = "1 data berhasil dihapus permanen!";
    private readonly nameColumn = "td:nth-child(5)";
    private readonly nikColumn = "td:nth-child(6)";
    private readonly genderColumn = "td:nth-child(8)";

    constructor(page: Page) {
        this.page = page;
    }

    async mapsToIndexPatientPage(): Promise<void> {
        await this.page.goto(this.patientIndexUrl);
    }

    async searchPatient(query: string): Promise<void> {
        await this.page.fill(this.searchInput, query);
        await this.page.click(this.searchButton);
        await this.waitForTableLoad();
    }

    async filterByStatus(status: "Aktif" | "Dihapus" | "Semua"): Promise<void> {
        await this.page.locator(this.statusFilterDropdown).selectOption({ label: status });
    }

    async searchPatientByStatus(nik: string, status: "Aktif" | "Dihapus" | "Semua"): Promise<void> {
        await this.filterByStatus(status);
        await this.searchPatient(nik);
    }

    async waitForTableLoad(): Promise<void> {
        await expect(this.page.locator(this.tableRows).first()).toBeVisible();
    }

    async getTableRowCount(): Promise<number> {
        await this.waitForTableLoad();
        return await this.page.locator(this.tableRows).count();
    }

    async getPatientNikByIndex(index: number): Promise<string> {
        const rows = this.page.locator(this.tableRows);
        await rows.first().waitFor();
        const targetRow = rows.nth(index);
        const nikText = await targetRow.locator(this.nikColumn).innerText();
        return nikText.trim();
    }

    async getPatientNameByIndex(index: number): Promise<string> {
        const rows = this.page.locator(this.tableRows);
        await rows.first().waitFor();
        const targetRow = rows.nth(index);
        const nameText = await targetRow.locator(this.nameColumn).innerText();
        return nameText;
    }

    async getPatientGenderByIndex(index: number): Promise<string> {
        const rows = this.page.locator(this.tableRows);
        await rows.first().waitFor();
        const targetRow = rows.nth(index);
        const genderText = await targetRow.locator(this.genderColumn).innerText();
        return genderText;
    }

    async selectFirstPatient(): Promise<void> {
        await this.page.locator(this.checkbox).first().check();
    }

    async clickDelete(): Promise<void> {
        await this.page.locator(this.deleteButton).click();
    }

    async clickPermanentDelete(): Promise<void> {
        await this.page.locator(this.permanentDeleteButton).click();
    }

    async clickRestore(): Promise<void> {
        await this.page.locator(this.restoreButton).click();
    }

    async getDeleteNotificationText() {
        return await this.page.getByText(this.deleteSuccessMessage).textContent();
    }

    async getpermanentDeleteSuccessMessage() {
        return await this.page.getByText(this.permanentDeleteSuccessMessage).textContent();
    }

    async openPatientDetail(): Promise<void> {
        await this.page.dblclick(this.dataTableSearchResult);
    }

    private getPatientRowByNik(nik: string): Locator {
        const escapedNik = nik.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return this.page
            .locator("table tbody tr")
            .filter({ has: this.page.locator("td:nth-child(6)", { hasText: new RegExp(`^\\s*${escapedNik}\\s*$`) }) })
            .first();
    }

    async openFirstPatientDetailByNik(nik: string): Promise<void> {
        const patientRow = this.getPatientRowByNik(nik);
        await patientRow.waitFor({ state: "visible" });
        await Promise.all([this.page.waitForURL(/\/pasien\/show/), patientRow.dblclick()]);
    }

    async getPatientSummaryByNik(nik: string): Promise<{ nik: string | null; nama: string | null; gender: string | null }> {
        const patientRow = this.getPatientRowByNik(nik);
        await patientRow.waitFor({ state: "visible" });
        const nama = await patientRow.locator(this.nameColumn).textContent();
        const nikText = await patientRow.locator(this.nikColumn).textContent();
        const gender = await patientRow.locator(this.genderColumn).textContent();
        return { nik: nikText, nama, gender };
    }
}