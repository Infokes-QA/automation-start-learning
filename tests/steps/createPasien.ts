import { createBdd } from "playwright-bdd";
import { getPageContext } from "./step.shared";
import { PendaftaranHelper } from "../helpers/pendaftaran.helper";
import { test } from "../fixtures/pages.fixture";
import { PasienHelper } from "../helpers/pasien.helper";

const { Given, When, Then } = createBdd(test);

/** Opens the Pendaftaran Pasien submenu from the Pendaftaran navigation. */
Given("the User is on the Create Pasien page", async ({ page, pages }) => {
  const pageContext = getPageContext(page, pages);
  await PendaftaranHelper.navigateToCreatePatientPage(pageContext);
});

/** Fills the mandatory patient form, then stores the resulting patient context. */
When("the User fills in patient profile with random data for {string}", async ({ page, pages, testContext }, gender: string) => {
    const pageContext = getPageContext(page, pages);
    await PendaftaranHelper.fillBuatBaruPasienForm(pageContext, testContext, gender);
  },
);

/** submits the patient form, then stores the resulting patient context. */
When("the User saves the patient data", async ({ page, pages }) => {
  const pageContext = getPageContext(page, pages);
  await PendaftaranHelper.submitPatientForm(pageContext);
});

/** Searches the current patient list using the canonical NIK stored in test context. */
Then("user should see the patient listed in the patient index", async ({ page, pages, testContext }, nik: string) => {
    const pageContext = getPageContext(page, pages);
    await PasienHelper.navigateToIndexPasienPage(pageContext);
    await PasienHelper.searchPasienByNik(pageContext, testContext, nik);
  }
);