import type { Page } from "@playwright/test";
import { BasePage } from "../base.pages";
import { pasienKkLocators } from "./pasien.kk.locators";
import type { PatientData } from "../../data/pasien.data";

export class PasienKkPage extends BasePage {
    readonly element: ReturnType<typeof pasienKkLocators>;
    constructor(page: Page) {
        super(page);
        this.element = pasienKkLocators(page);
    }
    
    async bukaHalamanPasienKk() {
        await this.goto("/pasien");
    }

    async isiNIKPasien(nik: string) {
        await this.fill(this.element.searchNIK, nik);
    }

    async klikTombolCari() {
        await this.click(this.element.buttonCari);
    }

    async klikBuatBaru() {
        await this.click(this.element.linkBuatBaru);
    }

    async isiFormPasienBaru(data: PatientData) {
        await this.fill(this.element.inputNIKBaru, data.nik);
        await this.fill(this.element.inputNamaLengkap, data.nama);
        await this.fill(this.element.inputUmurTahun, data.umurTahun);
        await this.fill(this.element.inputUmurBulan, data.umurBulan);
        await this.fill(this.element.inputUmurHari, data.umurHari);
        await this.fill(this.element.inputNomorHp, data.nomorHp);
        await this.click(this.element.genderOption(data.gender));
    }

    async simpanPasienBaru() {
        await this.click(this.element.buttonSimpan);
    }

    async verifikasiDataPasienTerdaftar(patientData: PatientData) {
        const element = this.element.findElementUsingPatientData(patientData);
        await this.waitVisible(element);
    }

    async verifikasiNamaPasienTerlihat(namaPasien: string) {
        const element = this.element.findElementUsingText(namaPasien);
        await this.waitVisible(element);
    }

    async verifikasiNIKPasienTerlihat(nikPasien: string) {
        const element = this.element.findElementUsingText(nikPasien);
        await this.waitVisible(element);
    }

    
}
