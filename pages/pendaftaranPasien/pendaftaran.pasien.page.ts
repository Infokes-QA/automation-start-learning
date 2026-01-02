import type { Page } from "@playwright/test";
import { BasePage } from "../base.pages";
import { PendaftaranPasienLocators } from "./pendaftaran.pasien.locators";

export class PendaftaranPasienPage extends BasePage {
    readonly element: ReturnType<typeof PendaftaranPasienLocators>;
    constructor(page: Page) {
        super(page);
        this.element = PendaftaranPasienLocators(page);
    }

    async menujuFormPendaftaranPasien() {
        await this.goto('/pendaftaran', { waitUntil: 'domcontentloaded' });
        const hasSearch = await this.tryWaitVisible(this.element.searchNamaPasien, 5_000);
        if (hasSearch) return;

        const lihatSemua = this.page.getByRole('link', { name: /^Lihat Semua$/ }).first();
        if (await this.tryWaitVisible(lihatSemua, 2_000)) {
            await this.click(lihatSemua);
            await this.waitVisible(this.element.searchNamaPasien, 10_000);
            return;
        }

        // Last fallback: force the list page again.
        await this.goto('/pendaftaran', { waitUntil: 'domcontentloaded' });
        await this.waitVisible(this.element.searchNamaPasien, 10_000);
    }

    async isiNamaPasien(namaPasien: string) {
        await this.fill(this.element.searchNamaPasien, namaPasien);
    }
    
    async klikTombolCari() {
        await this.press(this.element.searchNamaPasien, 'Enter', { timeoutMs: 3000, retry: { retries: 0 } }).catch(() => {});
        await this.click(this.element.buttonCari);
        await this.waitVisible(this.element.rows.first());
    }

    async cariDanTungguHasilMengandungNama(namaPasien: string, timeoutMs = 90_000) {
        const expectedRaw = namaPasien.trim();
        const expected = expectedRaw.toLowerCase();
        const startedAt = Date.now();
        let lastResults: string[] = [];

        while (Date.now() - startedAt < timeoutMs) {
            await this.klikTombolCari();
            lastResults = (await this.element.rows.allInnerTexts().catch(() => []))
                .map((r) => r.trim())
                .filter(Boolean);

            const hasMatch = lastResults.some((r) => r.toLowerCase().includes(expected));
            if (hasMatch) return;

            await this.page.waitForTimeout(2000);
        }

        throw new Error(
            `Nama pasien ${expectedRaw} tidak ditemukan dalam hasil pencarian (timeout ${timeoutMs}ms). ` +
                `Hasil terakhir: ${lastResults.slice(0, 5).join(' | ') || '(kosong)'}`,
        );
    }

    async verifikasiHasilPencarianNama(namaPasien: string) {
        await this.cariDanTungguHasilMengandungNama(namaPasien, 90_000);
    }

    async verifikasiHasilPencarianRuangan(ruangan: string) {
        const results = await this.element.searchResultRuanganDaftar.allInnerTexts();
        const expected = ruangan.trim().toLowerCase();
        const hasMatch = results.some((r) => r.trim().toLowerCase().includes(expected));
        if (!hasMatch) {
            throw new Error(`Ruangan ${ruangan} tidak ditemukan dalam hasil pencarian.`);
        }
    }

    async verifikasiHasilPencarianAsuransi(asuransi: string) {
        const results = await this.element.searchResultAsuransi.allInnerTexts();
        const expected = asuransi.trim().toLowerCase();
        const hasMatch = results.some((r) => r.trim().toLowerCase().includes(expected));
        if (!hasMatch) {
            throw new Error(`Asuransi ${asuransi} tidak ditemukan dalam hasil pencarian.`);
        }
    }
    async getPendaftaranId(): Promise<string> {
        const results = await this.element.searchPendaftaranId.allInnerTexts();
        return results.map((r) => r.trim()).filter(Boolean)[0] ?? "";
    }
}