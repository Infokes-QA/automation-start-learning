import type { Page } from "@playwright/test";
import { BasePage } from "../base.pages";
import { pasienKkLocators } from "./pasien.kk.locators";

export class PasienKkPage extends BasePage {
    readonly element: ReturnType<typeof pasienKkLocators>;
    constructor(page: Page) {
        super(page);
        this.element = pasienKkLocators(page);
    }
    
    async bukaHalamanPasienKk() {
        await this.goto("/pasien");
    }

    async isiNamaPasien(name: string) {
        await this.fill(this.element.searchNama, name);
    }

    async isiNIKPasien(nik: string) {
        await this.fill(this.element.searchNIK, nik);
    }

    async klikTombolCari() {
        await this.click(this.element.buttonCari);
    }

    async cariDanTungguHasil(searchKey: string, waitKey?: string, timeoutMs = 25_000) {
        const expectedKey = (waitKey ?? searchKey).trim();
        const startedAt = Date.now();
        while (Date.now() - startedAt < timeoutMs) {
            await this.press(this.element.searchNIK, 'Enter', { timeoutMs: 2000, retry: { retries: 0 } }).catch(() => {});
            await this.click(this.element.buttonCari);

            const row = await this.element.findSpecificTableRowUsingString(expectedKey);
            const found = await this.tryWaitVisible(row.first(), 2000);
            if (found) return;

            await this.page.waitForTimeout(1500);
        }

        throw new Error(`Timeout menunggu data pasien muncul di tabel untuk key: ${expectedKey}`);
    }

    async verifikasiNamaDiTabel(namaPasien: string) {
        const row = await this.element.findSpecificTableRowUsingString(namaPasien);
        await this.waitVisible(row);
    }

    async verifikasiNIKDiTabel(nikPasien: string) {
        const row = await this.element.findSpecificTableRowUsingString(nikPasien);
        await this.waitVisible(row);
    }

    async menujuDetailPasien(namaPasien: string) {
        const row = await this.element.findSpecificTableRowUsingString(namaPasien);
        const stable = await this.tryWaitVisible(row.first(), 2_000);
        if (stable) {
            await this.dblclick(row.first());
            return;
        }

        // Fallback pilih row pertama
        const firstDataRow = this.page.locator('table tbody tr').first();
        await this.dblclick(firstDataRow);
    }
    
    async klikTombolPendaftaran() {
        await this.click(this.element.buttonPendaftaran);
    }

    async validasiHalamanDetailPasien() {
        // Detail pasien bisa ada dua, ke pendaftaran atai ke pasien langsung
        // - Pasien detail: "Lihat Data Pasien"
        // - Pendaftaran detail: "Lihat Data Pendaftaran" (e.g. /pendaftaran/show/...) 
        const isPasienDetail = await this.tryWaitVisible(this.element.labelLihatDataPasien, 5_000);
        if (isPasienDetail) return;
        await this.waitVisible(this.element.labelLihatDataPendaftaran);
    }


    async tryAmbilNamaPasienDiHalamanDetail(): Promise<string | null> {
        // Pattern 1: label "Nama:" followed by <strong>NAME</strong>
        const nameByStrong = this.page.locator('xpath=//*[normalize-space()="Nama:"]/following::strong[1]').first();
        if (await this.tryWaitVisible(nameByStrong, 1_000)) {
            const t = (await nameByStrong.innerText().catch(() => '')).trim();
            if (t) return t;
        }

        // Pattern 2: di patient detail biasanya ada input "Nama Lengkap".
        if (await this.tryWaitVisible(this.element.fieldNama, 1_000)) {
            const t = (await this.element.fieldNama.inputValue().catch(() => '')).trim();
            if (t) return t;
        }

        // Pattern 2b: nama menggunakan label layout
        const nameByLabelValue = this.page.locator('label:has-text("Nama") + div').first();
        if (await this.tryWaitVisible(nameByLabelValue, 1_000)) {
            const t = (await nameByLabelValue.innerText().catch(() => '')).trim();
            if (t) return t.split(/\r?\n/)[0]?.trim() || t;
        }

        // Pattern 3: cari dari NIK terus nama patient
        const bodyText = (await this.page.locator('body').innerText().catch(() => '')).trim();
        if (bodyText) {
            const lines = bodyText
                .split(/\r?\n/)
                .map((l) => l.trim())
                .filter(Boolean);

            for (let i = 0; i < lines.length; i += 1) {
                if (!/^NIK\s*:/i.test(lines[i])) continue;

                for (let j = i + 1; j < Math.min(i + 8, lines.length); j += 1) {
                    const cand = lines[j];
                    if (cand.includes(':')) continue;
                    if (/^(laki-laki|perempuan)$/i.test(cand)) continue;
                    if (/^\d+$/.test(cand)) continue;
                    if (cand.length < 2 || cand.length > 80) continue;
                    return cand;
                }
            }
        }

        return null;
    }

    async pilihStatusKunjungan(status: string) {
        await this.check(this.element.radioStatusKunjungan(status));
    }

    async tandaiCkgJikaMuncul() {
        const visible = await this.tryWaitVisible(this.element.ckgCheckbox, 1500);
        if (visible) {
            await this.check(this.element.ckgCheckbox, { timeoutMs: 5000 });
        }
    }

    async pilihAsuransi(asuransi: string) {
        await this.selectOptionByLabel(this.element.asuransiCombobox, asuransi);
    }

    async pilihInstalasi(instalasi: string) {
        await this.click(this.element.instalasiButton(instalasi));
    }

    async pilihPoli(poli: string) {
        await this.click(this.element.poliButton(poli));
    }

    async pilihJadwalDokter(jadwalDokter: string) {
        await this.click(this.element.jadwalDokterButton(jadwalDokter));
    }

    async isiNoHpPasienPendaftaran(noHp: string) {
        await this.fill(this.element.phoneNumberfield, noHp);
    }

    async isiTinggiBeratBadanJikaKosong(tinggiCm = '170', beratKg = '70') {
        const tinggiVisible = await this.tryWaitVisible(this.element.tinggiBadanField, 2_000);
        const beratVisible = await this.tryWaitVisible(this.element.beratBadanField, 2_000);

        // Beberapa environment/flow tidak menampilkan field tinggi/berat badan; anggap opsional.
        if (!tinggiVisible || !beratVisible) return;

        const tinggiNow = (await this.element.tinggiBadanField.inputValue().catch(() => '')).trim();
        if (!tinggiNow) {
            await this.fill(this.element.tinggiBadanField, tinggiCm, { clearFirst: true });
            await this.press(this.element.tinggiBadanField, 'Tab', { timeoutMs: 2_000, retry: { retries: 0 } }).catch(() => {});
        }

        const beratNow = (await this.element.beratBadanField.inputValue().catch(() => '')).trim();
        if (!beratNow) {
            await this.fill(this.element.beratBadanField, beratKg, { clearFirst: true });
            await this.press(this.element.beratBadanField, 'Tab', { timeoutMs: 2_000, retry: { retries: 0 } }).catch(() => {});
        }
    }

    async tungguFormPendaftaranSiapDisimpan(timeoutMs = 10_000) {
        await this.waitForPopulated(this.element.buttonSimpan, timeoutMs, 500);
    }

    async tungguTombolSimpanAktif(timeoutMs = 30_000) {
        const startedAt = Date.now();
        while (Date.now() - startedAt < timeoutMs) {
            if (await this.element.buttonSimpan.isEnabled().catch(() => false)) return;
            await this.page.waitForTimeout(250);
        }
        throw new Error('Tombol Simpan tetap non-aktif (disabled) setelah menunggu');
    }

    async validasiPesanSuksesPendaftaran(
        timeoutMs = 90_000,
        options?: { allowErrorToastAsWarning?: boolean },
    ) {
        const notify = this.page.locator('[data-notify="container"]').first();
        const successToast = this.page.locator('[data-notify="container"].alert-success').first();
        const errorToast = this.page
            .locator('[data-notify="container"].alert-danger, [data-notify="container"].alert-warning')
            .first();

        const startedAt = Date.now();
        while (Date.now() - startedAt < timeoutMs) {
            if (await this.tryWaitVisible(successToast, 500)) return;
            if (await this.tryWaitVisible(errorToast, 500)) {
                const msg = (await errorToast.innerText().catch(() => '')).trim();

                if (options?.allowErrorToastAsWarning) {
                    console.warn(`[warn] Pendaftaran error toast (ignored): ${msg || '(no text)'}`);
                    return;
                }

                throw new Error(`Pendaftaran gagal (toast): ${msg || '(no text)'}`);
            }

            // untuk handle notif input pendaftaran gagal tapi data masuk
            if (await this.tryWaitVisible(notify, 500)) {
                const cls = (await notify.getAttribute('class').catch(() => '')) ?? '';
                if (cls.includes('alert-danger') || cls.includes('alert-warning')) {
                    const msg = (await notify.innerText().catch(() => '')).trim();

					if (options?.allowErrorToastAsWarning) {
						console.warn(`[warn] Pendaftaran notify error (ignored): ${msg || '(no text)'}`);
						return;
					}

					throw new Error(`Pendaftaran gagal (toast): ${msg || '(no text)'}`);
                }
                return;
            }

            await this.page.waitForTimeout(250);
        }

        throw new Error('Timeout menunggu toast sukses pendaftaran');
    }

    async pilihKamar(kamar: string) {
        await this.click(this.element.kamarButton(kamar));
    }

    async pilihBed(bed: string) {
        await this.click(this.element.bedButton(bed));
    }

    async clickDropHapus() {
        const pasienDetailDropup = this.page
            .getByRole('button', { name: /^Hapus$/ })
            .first()
            .locator('xpath=following-sibling::button[contains(@class,"dropdown-toggle") and @aria-haspopup="true"]');

        if (await this.tryWaitVisible(pasienDetailDropup, 2_000)) {
            await this.click(pasienDetailDropup);
            return;
        }

        //fall back, karena ada yg hapus ada yg ubah jadi satu dropdown
        const pendaftaranDetailDropup = this.page
            .getByRole('link', { name: /^Ubah$/ })
            .first()
            .locator('xpath=following-sibling::button[contains(@class,"dropdown-toggle") and @aria-haspopup="true"]');

        if (await this.tryWaitVisible(pendaftaranDetailDropup, 2_000)) {
            await this.click(pendaftaranDetailDropup);
            return;
        }

        // Last fallback.
        await this.click(this.page.getByRole('button', { name: 'Toggle Dropup' }).first());
    }

    async clickHapusPermanen(){
        // Kalau pasien sudah punya banyak riwayat
        // buttonya jadi "Hapus Semua Pemeriksaan", tapi kalo cuman satu "Hapus Permanen".
        try {
            await this.click(this.element.buttonHapusSemuaPemeriksaan, { timeoutMs: 5_000, retry: { retries: 0 } });
        } catch {
            await this.click(this.element.buttonHapusPermanen, { timeoutMs: 5_000, retry: { retries: 0 } });
        }
    }

    private async ensureDeletionAuthorizationDialogOpen(): Promise<void> {
        await this.ensureDialogOpenByClickingTrigger({
            dialogAnchor: this.element.passwordOtorisasiInput,
            triggerButton: this.element.bulkHapusButton,
            timeoutMs: 10_000,
        });
    }

    async inputPasswordOtorisasi(password: string){
        await this.ensureDeletionAuthorizationDialogOpen();
        try {
            await this.fillInDialogContaining(
                this.element.passwordOtorisasiInput,
                (dialog) => dialog.getByPlaceholder(/Password\s+Otorisasi/i),
                password,
            );
            return;
        } catch {
            const input = this.element.passwordOtorisasiInput.first();
            await this.fill(input, password);
        }
    }
    async inputKeteranganHapus(keterangan: string){
        await this.ensureDeletionAuthorizationDialogOpen();
        try {
            await this.fillInDialogContaining(
                this.element.passwordOtorisasiInput,
                (dialog) => dialog.getByPlaceholder('Keterangan'),
                keterangan,
            );
            return;
        } catch {
            const input = this.element.keteranganHapusInput.first();
            await this.fill(input, keterangan);
        }
    }
    async confirmDeletionPendaftaran(){
        await this.ensureDeletionAuthorizationDialogOpen();
        try {
            await this.clickInDialogContaining(
                this.element.passwordOtorisasiInput,
                (dialog) => dialog.getByRole('button', { name: /^Hapus$/ }),
            );
            return;
        } catch {
            // Last fallback: click any visible "Hapus" inside the visible dialog.
            await this.click(this.element.deletionDialog.getByRole('button', { name: /^Hapus$/ }).first());
        }
    }

    async inputBPJSNumber(bpjsNumber: string) {
        await this.waitVisible(this.element.bpjsNumberField);
        await this.element.bpjsNumberField.click({ timeout: this.defaultTimeoutMs });
        await this.element.bpjsNumberField.fill('');

        await this.element.bpjsNumberField.type(bpjsNumber, { delay: 40 });
        const autoCompletePopup = this.page.locator(
            'ul.ui-autocomplete:visible, [role="listbox"]:visible, .ui-menu:visible, .ui-autocomplete:visible',
        );
        const suggestionsVisible = await this.tryWaitVisible(autoCompletePopup.first(), 10_000);
        if (!suggestionsVisible) {
            throw new Error(`Autocomplete BPJS tidak muncul untuk nomor: ${bpjsNumber}`);
        }

        await this.element.bpjsNumberField.press('ArrowDown');
        await this.element.bpjsNumberField.press('Enter');

        const selectedValue = (await this.element.bpjsNumberField.inputValue({ timeout: 2_000 }).catch(() => '')) ?? '';
        if (selectedValue.trim().length === 0) {
            throw new Error(`BPJS field masih kosong setelah pilih autocomplete (input: ${bpjsNumber})`);
        }

        // Click the search/bridging button (setPesertaBpjs) if present.
        if (await this.tryWaitVisible(this.element.buttonBridgingBPJS, 2_000)) {
            await this.click(this.element.buttonBridgingBPJS, { timeoutMs: 10_000, retry: { retries: 0 } }).catch(() => {});
        }

        const hasValidateButton = await this.tryWaitVisible(this.element.buttonValidateBPJS, 2_500);
        if (hasValidateButton) {
            await this.click(this.element.buttonValidateBPJS);
            await this.validasiPesanSuksesPendaftaran();
            return;
        }

        await this.tryWaitVisible(this.element.generalAlertMessage.first(), 2_000);
    }

    async pickFirstBpjsFromAutocomplete(prefix = '000'): Promise<string> {
        await this.waitVisible(this.element.bpjsNumberField);
        await this.element.bpjsNumberField.click({ timeout: this.defaultTimeoutMs });
        await this.element.bpjsNumberField.fill('');
        await this.element.bpjsNumberField.fill(prefix);

        const autoCompleteList = this.page.locator('ul.ui-autocomplete');
        const suggestionsVisible = await this.tryWaitVisible(autoCompleteList.first(), 5_000);
        if (!suggestionsVisible) {
            throw new Error(`BPJS autocomplete tidak muncul saat mengetik prefix: ${prefix}`);
        }

        await this.element.bpjsNumberField.press('ArrowDown');
        await this.element.bpjsNumberField.press('Enter');

        if (await this.tryWaitVisible(this.element.buttonBridgingBPJS, 2_000)) {
            await this.click(this.element.buttonBridgingBPJS, { timeoutMs: 10_000, retry: { retries: 0 } }).catch(() => {});
        }

        const inputGroup = this.element.bpjsNumberField.locator('xpath=ancestor::div[contains(@class,"input-group")]').first();
        const startedAt = Date.now();
        while (Date.now() - startedAt < 8_000) {
            const cls = (await inputGroup.getAttribute('class', { timeout: 1_000 }).catch(() => '')) ?? '';
            const currentValue = (await this.element.bpjsNumberField.inputValue({ timeout: 1_000 }).catch(() => '')) ?? '';
            if (cls.includes('has-success') && currentValue.trim().length > 0) return currentValue;
            await this.page.waitForTimeout(250);
        }

        const finalCls = (await inputGroup.getAttribute('class', { timeout: 1_000 }).catch(() => '')) ?? '';
        const finalValue = (await this.element.bpjsNumberField.inputValue({ timeout: 1_000 }).catch(() => '')) ?? '';
        throw new Error(`BPJS autocomplete belum tervalidasi (class: ${finalCls || '-'}, value: ${finalValue || '-'})`);
    }

    async tutupBPJSDialog(){
        await this.clickInDialogContaining(
            this.element.textBerhasilTerkirimBPJS,
            (dialog) => dialog.getByRole('button', { name: /^Tutup$/ }),
        );
    }

    async tutupBPJSDialogJikaMuncul(timeoutMs = 4_000): Promise<boolean> {
        const dialog = this.getDialogContaining(this.element.textBerhasilTerkirimBPJS);
        const visible = await this.tryWaitVisible(dialog, timeoutMs);
        if (!visible) return false;

        await this.click(dialog.getByRole('button', { name: /^Tutup$/ }), {
            timeoutMs: 10_000,
            retry: { retries: 0 },
        }).catch(() => {});

        await this.waitHidden(dialog, 10_000).catch(() => {});
        return true;
    }

    async clickKonfirmasiHapusSemuaPemeriksaan(){
        await this.click(this.element.buttonConfirmHapusSemuaPemeriksaan);
    }

    
}