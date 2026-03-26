import { env } from "../../config/env.config";
import { PageContext, TestContext } from "../fixtures/pages.fixture";
import {
  createGeneratedUiPatientContext,
  getRegisteredPatientContext,
} from "./pendaftaran/PendaftaranHelperSupport";

export class PendaftaranHelper {
  /** Returns the canonical patient context and backfills it from legacy fields during migration. */
  private static getRegisteredPatient(testContext: TestContext) {
    return getRegisteredPatientContext(testContext);
  }

  /**
   * Navigate to Pasien page and verify URL
   * Equivalent to: Given('the user is on the Pasien page at {string}')
   */
  static async navigateToPendaftaranPasienPage(pageContext: PageContext): Promise<void> {
    await pageContext.pages.homePage.gotoPendaftaranPasien();
  }

  static async navigateToCreatePatientPage(pageContext: PageContext): Promise<void> {
    await pageContext.pages.pendaftaranPage.navigateToCreatePatientPage();
  }

  /**
   * Fills the mandatory patient creation form and updates the canonical patient
   * context for downstream steps.
   */
  static async fillBuatBaruPasienForm(
    pageContext: PageContext,
    testContext: TestContext,
    gender: string,
  ): Promise<void> {
    const patientData = createGeneratedUiPatientContext(testContext);
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

  /** Searches the patient list by NIK and validates the first matching result row. */
  static async searchPasienByNik(pageContext: PageContext, testContext: TestContext, nikInput?: string): Promise<void> {
    const nik = nikInput?.trim() || this.getRegisteredPatient(testContext).nikPasien;
    if (!nik) {
      throw new Error("NIK for registered patient is missing in test context.");
    }
    testContext.nik = nik;
    if (testContext.registeredPatient) {
      testContext.registeredPatient = { ...testContext.registeredPatient, nikPasien: nik };
    }

    await pageContext.pages.indexPasienPage.cariDataPasien(nik);
    await pageContext.pages.indexPasienPage.assertPasienListedByNik(nik);
  }
}
