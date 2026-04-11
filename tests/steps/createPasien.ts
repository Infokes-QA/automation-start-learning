import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { getPageContext } from "./step.shared";
import { PendaftaranHelper } from "../helpers/pendaftaran.helper";
import { test } from "../fixtures/pages.fixture";
import { PasienHelper } from "../helpers/pasien.helper";
import { normalizeGenderText, clean } from "../helpers/pendaftaran/PendaftaranHelperSupport";

const { Given, When, Then } = createBdd(test);

Given("the user is on the create patient page", async ({ page, pages }) => {
  const pageContext = getPageContext(page, pages);
  await PendaftaranHelper.goToCreatePatientPage(pageContext);
});

When("the user fills in patient form with random data for {string}", async ({ page, pages, testContext }, gender: string) => {
  const pageContext = getPageContext(page, pages);
  await PendaftaranHelper.fillCreatePasienForm(pageContext, testContext, gender);
});

When("the user saves the patient data", async ({ page, pages }) => {
  const pageContext = getPageContext(page, pages);
  await PendaftaranHelper.submitPatientForm(pageContext);
});

Then("the user should verify that the patient's data are displayed correctly in the index", async ({ page, pages, testContext }, nik: string) => {
  const pageContext = getPageContext(page, pages);
  await PasienHelper.goToIndexPasienPage(pageContext);
  const { nik: expectedNik, actualNik, actualName, gender } = await PasienHelper.searchPasienUsingNik(pageContext, testContext, nik);
  const expectedName = testContext.patientDataGlobal?.namaPasien;
  const expectedGender = testContext.expectedGender;
  if (!expectedName || !expectedGender) {
    throw new Error("Expected patient name or gender is missing in test context.");
  }
  expect(clean(actualNik)).toBe(clean(expectedNik));
  expect(clean(actualName)).toBe(clean(expectedName));
  expect(normalizeGenderText(gender)).toBe(normalizeGenderText(expectedGender));
});