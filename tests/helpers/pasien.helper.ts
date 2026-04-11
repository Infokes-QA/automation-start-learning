import { PageContext, TestContext } from "../fixtures/pages.fixture";
import {
  getRegisteredPatientContext,
} from "./pendaftaran/PendaftaranHelperSupport";

export class PasienHelper {

  private static getRegisteredPatient(testContext: TestContext) {
    return getRegisteredPatientContext(testContext);
  }

  static async goToIndexPasienPage(pageContext: PageContext): Promise<void> {
    await pageContext.pages.indexPasienPage.mapsToIndexPatientPage();
  }

  static async searchPasienUsingNik(
    pageContext: PageContext,
    testContext: TestContext,
    nikPasien?: string,
  ): Promise<{ nik: string; actualName: string | null; actualNik: string | null; gender: string | null }> {
    const nik = nikPasien?.trim() || this.getRegisteredPatient(testContext).nikPasien;
    if (!nik) {
      throw new Error("NIK for registered patient is missing in test context.");
    }
    testContext.nik = nik;
    if (testContext.registeredPatient) {
      testContext.registeredPatient = { ...testContext.registeredPatient, nikPasien: nik };
    }

    await pageContext.pages.indexPasienPage.searchPatient(nik);
    const patientSummary = await pageContext.pages.indexPasienPage.getPatientSummaryByNik(nik);
    return { nik, actualName: patientSummary.nama, actualNik: patientSummary.nik, gender: patientSummary.gender };
  }
}