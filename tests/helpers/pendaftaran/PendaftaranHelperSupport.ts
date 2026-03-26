import { PageContext, TestContext, RegisteredPatientContext } from "../../fixtures/pages.fixture";
import { generatePasienDataUmum } from "../../fixtures/patientData.fixture";

export function normalizeUiText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

export function parsePasienIdFromCurrentUrl(pageContext: PageContext): string | undefined {
  const match = pageContext.page.url().match(/\/pasien\/show\/([^/?#]+)/);
  return match?.[1];
}

export function getRegisteredPatientContext(testContext: TestContext): RegisteredPatientContext {
  if (testContext.registeredPatient) {
    return testContext.registeredPatient;
  }

  const nikPasien = testContext.nik ?? testContext.patientDataGlobal?.nikPasien;
  const namaPasien = testContext.patientDataGlobal?.namaPasien;
  const phoneNumber = testContext.patientDataGlobal?.phoneNumber;
  if (!nikPasien || !namaPasien || !phoneNumber) {
    throw new Error("registeredPatient context is missing. Run patient setup precondition first.");
  }

  const fallback: RegisteredPatientContext = {
    nikPasien,
    namaPasien,
    phoneNumber,
    source: "ui",
  };
  testContext.registeredPatient = fallback;
  return fallback;
}

export function createGeneratedUiPatientContext(testContext: TestContext): {
  nikPasien: string;
  namaPasien: string;
  tanggalLahir: string;
  phoneNumber: string;
} {
  const patientData = generatePasienDataUmum();
  testContext.patientDataGlobal = patientData;
  testContext.nik = patientData.nikPasien;

  return patientData;
}
