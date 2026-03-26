import { PageContext, TestContext } from "../fixtures/pages.fixture";
import {
  getRegisteredPatientContext,
} from "./pendaftaran/PendaftaranHelperSupport";

export class PasienHelper {
  
  /** Returns the canonical patient context and backfills it from legacy fields during migration. */
  private static getRegisteredPatient(testContext: TestContext) {
    return getRegisteredPatientContext(testContext);
  }

  /**
   * Navigate to Pasien page and verify URL
   * Equivalent to: Given('the user is on the Pasien page at {string}')
   */
  static async navigateToIndexPasienPage(pageContext: PageContext): Promise<void> {
    await pageContext.pages.indexPasienPage.navigasiKeMenuPasien();
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