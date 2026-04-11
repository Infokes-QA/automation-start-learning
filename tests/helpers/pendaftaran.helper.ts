import { env } from "../../config/env.config";
import { PageContext, TestContext } from "../fixtures/pages.fixture";
import {
  createGeneratedPatientContext,
  getRegisteredPatientContext,
} from "./pendaftaran/PendaftaranHelperSupport";

export class PendaftaranHelper {

  private static getRegisteredPatient(testContext: TestContext) {
    return getRegisteredPatientContext(testContext);
  }

  static async goToPendaftaranPasienPage(pageContext: PageContext): Promise<void> {
    await pageContext.pages.pendaftaranPage.goToPendaftaranPasienPage();
  }

  static async goToCreatePatientPage(pageContext: PageContext): Promise<void> {
    await pageContext.pages.pendaftaranPage.goToCreatePatientPage();
  }

  static async fillCreatePasienForm(pageContext: PageContext, testContext: TestContext, gender: string): Promise<void> {
    const patientData = createGeneratedPatientContext(testContext);
    testContext.expectedGender = gender;
    await pageContext.pages.pendaftaranPage.createPasienUmum(
      patientData.nikPasien,
      patientData.namaPasien,
      patientData.tanggalLahir,
      patientData.phoneNumber,
      gender,
    );
  }

  static async submitPatientForm(pageContext: PageContext): Promise<void> {
    await pageContext.pages.pendaftaranPage.submitPatientForm();
  }

  static async searchPasienUsingNik(pageContext: PageContext, testContext: TestContext, nikInput?: string): Promise<void> {
    const nik = nikInput?.trim() || this.getRegisteredPatient(testContext).nikPasien;
    if (!nik) {
      throw new Error("NIK for registered patient is missing in test context.");
    }
    testContext.nik = nik;
    if (testContext.registeredPatient) {
      testContext.registeredPatient = { ...testContext.registeredPatient, nikPasien: nik };
    }

    await pageContext.pages.indexPasienPage.searchPatient(nik);
    await pageContext.pages.indexPasienPage.getPatientSummaryByNik(nik);
  }
}
