import { Locator, Page, expect } from "@playwright/test";

export class PendaftaranPage {
  private readonly page: Page;

  //Navigasi menu
  private readonly menuPendaftaran = "#menu_pendaftaran";
  private readonly submenuPendaftaranPasien = "#menu_pendaftaran_pendaftaran_v2";

  //tombol pendaftaran pasien
  private readonly buttonTambah = "#button_create";

  //tombol create pasien
  private readonly buttonBuatPasienBaru = "button:has-text('Buat Pasien Baru')";
  private readonly buttonSimpanPasien = "button:has-text('Simpan Pasien')";

  //Form create pasien
  private readonly fieldNIK = "input[placeholder='Nomor Induk Kependudukan (KTP)']";
  private readonly fieldNamaLengkap = "input[placeholder='Nama lengkap']";
  private readonly radiogenderLaki = "input[value='LAKI-LAKI']";
  private readonly radiogenderPerempuan = "input[value='PEREMPUAN']";
  private readonly fieldTanggalLahir = "div[class='col-sm-6'] input[placeholder='dd-mm-yyyy']";
  private readonly fieldNomorHp = "input[placeholder='Nomor HP']";

  constructor(page: Page) {
    this.page = page;
  }

  async goToIndexPendaftaranPasienPage(): Promise<void> {
    await this.page.click(this.menuPendaftaran);
    await this.page.click(this.submenuPendaftaranPasien);
  }

  async goToPendaftaranPasienPage(): Promise<void> {
      await this.goToIndexPendaftaranPasienPage();
      await this.page.click(this.buttonTambah);
  }

  async goToCreatePatientPage(): Promise<void> {
    await this.goToPendaftaranPasienPage();
    await this.page.click(this.buttonBuatPasienBaru);
    await this.page.waitForURL(/\/pendaftaran\/v2\/create/i);
  }

  private normalizegender(gender: string): "LAKI-LAKI" | "PEREMPUAN" {
    const normalized = gender.trim().toUpperCase().replace(/\s+/g, "-");
    if (normalized === "LAKI-LAKI" || normalized === "LAKI_LAKI") {
      return "LAKI-LAKI";
    }
    if (normalized === "PEREMPUAN") {
      return "PEREMPUAN";
    }
    throw new Error(
      `Unsupported gender "${gender}". Use LAKI-LAKI or PEREMPUAN (Scenario Outline Examples).`,
    );
  }

  async pilihgender(gender: string): Promise<void> {
    const value = this.normalizegender(gender);
    const selector =
      value === "LAKI-LAKI" ? this.radiogenderLaki : this.radiogenderPerempuan;
    await expect(this.page.locator(selector)).toBeVisible();
    await this.page.locator(selector).check();
  }

  async createPasienUmum(
    nik: string,
    name: string,
    tanggalLahir: string,
    phoneNumber: string,
    gender: string,
  ): Promise<void> {
    await this.page.fill(this.fieldNIK, nik);
    await this.page.fill(this.fieldNamaLengkap, name);
    await this.pilihgender(gender);
    await this.page.fill(this.fieldTanggalLahir, tanggalLahir);
    await this.page.fill(this.fieldNomorHp, phoneNumber);
  }

  async submitPatientForm(): Promise<void> {
    await this.page.click(this.buttonSimpanPasien);
    await this.page.waitForResponse(resp => resp.url().includes('/pasien/store') && resp.ok());
  }
  
}