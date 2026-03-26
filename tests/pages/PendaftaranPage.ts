import { Locator, Page, expect } from "@playwright/test";

export class PendaftaranPage {
  private readonly page: Page;

  // url pendaftaran pasien
  private readonly urlIndeksPendaftaranPasien = `${process.env.BASE_URL}/pendaftaran/v2?broadcastNotif=1`;

  //Navigasi menu
  private readonly menuPendaftaran = "#menu_pendaftaran";
  private readonly submenuPendaftaranPasien = "#menu_pendaftaran_pendaftaran_v2";

  //tombol pendaftaran pasien
  private readonly buttonTambah = "#button_create";

  //tombol create pasien
  private readonly buttonBuatPasienBaru = "button:has-text('Buat Pasien Baru')";
  private readonly buttonSimpanPasien = "button:has-text('Simpan Pasien')";

  //Form create pasien
  private readonly fieldNomorDokumenRekamMedis = "input[placeholder='Nomor Dokumen Rekam Medis']";
  private readonly fieldNomorRekamMedisLama = "input[placeholder='Nomor Rekam Medis Lama']";
  private readonly dropdownAsuransi = "div[class='fblock with-delete-btn'] select[class='form-control input-sm']";
  private readonly fieldNomorKartuPeserta = "input[placeholder='No. Kartu Peserta']";
  private readonly tombolValidasNomorKartuPeserta = ".input-group-addon.btn-info.pointer";
  private readonly pesanValidasiNomorKartuPeserta = "span[data-notify='message']";
  private readonly dataKepesertaanAsuransi = ".media-body";
  private readonly fieldKK = "input[placeholder='🔍 Nomor KK / NIK Anggota Keluarga']";
  private readonly fieldNIK = "input[placeholder='Nomor Induk Kependudukan (KTP)']";
  private readonly checkboxTidakBawaKTP = "input[value='1']";
  private readonly fieldIhsNumber = "#ihs_number_";
  private readonly fieldNamaLengkap = "input[placeholder='Nama lengkap']";
  private readonly radioJenisKelaminLaki = "input[value='LAKI-LAKI']";
  private readonly radioJenisKelaminPerempuan = "input[value='PEREMPUAN']";
  private readonly fieldTanggalLahir = "div[class='col-sm-6'] input[placeholder='dd-mm-yyyy']";
  private readonly fieldTempatLahir = "input[placeholder='Tempat lahir']";
  private readonly fieldNomorHp = "input[placeholder='Nomor HP']";
  private readonly fieldProvinsi = "input[placeholder='🔍 Nama Propinsi']";
  private readonly fieldKotaKab = "input[placeholder='🔍 Nama Kota / Kabupaten']";
  private readonly fieldKecamatan = "input[placeholder='🔍 Nama Kecamatan']";
  private readonly fieldKelurahan = "input[placeholder='🔍 Nama Kelurahan / Desa']";
  
  // Notification alert
  private readonly notifyTitle = "span[data-notify='title']";
  private readonly notifyMessage = "span[data-notify='message']";

  constructor(page: Page) {
    this.page = page;
  }

  async navigasiKeHalamanIndexPendaftaranPasien(): Promise<void> {
    await this.page.click(this.menuPendaftaran);
    await this.page.click(this.submenuPendaftaranPasien);
  }

  async navigasiKeHalamanPendaftaranPasien(): Promise<void> {
      await this.navigasiKeHalamanIndexPendaftaranPasien();
      await this.page.click(this.buttonTambah);
  }

  async navigateToCreatePatientPage(): Promise<void> {
    await this.navigasiKeHalamanPendaftaranPasien();
    await this.page.click(this.buttonBuatPasienBaru);
    await this.page.waitForURL(/\/pendaftaran\/v2\/create/i);
  }

  private normalizeJenisKelamin(gender: string): "LAKI-LAKI" | "PEREMPUAN" {
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

  async pilihJenisKelamin(gender: string): Promise<void> {
    const value = this.normalizeJenisKelamin(gender);
    const selector =
      value === "LAKI-LAKI" ? this.radioJenisKelaminLaki : this.radioJenisKelaminPerempuan;
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
    await this.pilihJenisKelamin(gender);
    await this.page.fill(this.fieldTanggalLahir, tanggalLahir);
    await this.page.fill(this.fieldNomorHp, phoneNumber);
  }

  async submitPatientForm(): Promise<void> {
    await this.page.click(this.buttonSimpanPasien);
    await this.page.waitForResponse(resp => resp.url().includes('/pasien/store') && resp.ok());
  }
  
}