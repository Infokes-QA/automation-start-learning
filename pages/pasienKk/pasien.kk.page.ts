import type { Page } from "@playwright/test";
import { BasePage } from "../base.pages";
import { pasienKkLocators } from "./pasien.kk.locators";
import { PasienDatas } from "../../data/interfaces/pasien.interface";

export class PasienKkPage extends BasePage {
    readonly element: ReturnType<typeof pasienKkLocators>;
    constructor(page: Page) {
        super(page);
        this.element = pasienKkLocators(page);
    }
    
    async bukaHalamanPasienKk() {
        await this.goto("/pasien");
    }

    async bukaHalamanCreatePasien() {
        await this.goto("/pasien/create");
    }

    async isiNIKPasien(nik: string) {
        await this.fill(this.element.searchNIK, nik);
    }

    async klikTombolCari() {
        await this.click(this.element.buttonCari);
    }

    async verifikasiNamaDiTabel(namaPasien: string) {
        const row = await this.element.findSpecificTableRowUsingString(namaPasien);
        await this.expectVisible(row);
    }

    async verifikasiNIKDiTabelPasien(nikPasien: string) {
        const row = await this.element.findSpecificTableRowUsingString(nikPasien);
        await this.expectVisible(row);
    }

    async navigatesToCreatePasienPage() {
        await this.click(this.element.buttonCreatePasien);
    }

    async fillFormPasien(data: PasienDatas) {
        await this.element.nikField.fill(data.nik);
        await this.element.nameField.fill(data.nama);
        if(data.jenisKelamin === 'L') {
            await this.click(this.element.maleRadioButton);
            //console.log("Kamu lakik");
        } else if(data.jenisKelamin === 'P') {
            await this.click(this.element.femaleRadioButton);
            //console.log("Kamu perempuan");
        } else{
            console.warn(`Jenis kelamin for patient ${data.nama} is not specified or invalid. Skipping gender selection.`); 
        }

        // Optional: Add a small log or console.info for easier debugging in CI
        console.log(`Filling form for patient: ${data.nama} (NIK: ${data.nik}) (Jenis Kelamin: ${data.jenisKelamin})`);
    }

    async submitFormPasien() {
        await this.click(this.element.submitButton);
    }

    async verifikasiNIKDiTabel(data: PasienDatas) {
        await this.expectVisible(this.page.getByText(data.nik));
        await this.expectVisible(this.page.getByText(data.nama));
        if (data.jenisKelamin === 'L') {
            await this.expectVisible(this.page.getByText('Laki-laki'));
        } else if (data.jenisKelamin === 'P') {
            await this.expectVisible(this.page.getByText('Perempuan'));
        } else {
            console.warn(`Jenis kelamin for patient ${data.nama} is not specified or invalid. Skipping gender verification in table.`);
        }
    }
}