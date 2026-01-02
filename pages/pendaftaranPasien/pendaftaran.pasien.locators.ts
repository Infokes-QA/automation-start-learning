import { Page } from "@playwright/test";

export const PendaftaranPasienLocators = (page: Page) => ({
    searchNamaPasien: page.getByPlaceholder("Pencarian"),
    buttonCari: page.getByPlaceholder("Pencarian").locator('..').getByRole("button", { name: /^Cari$/ }),
    rows: page.locator('table tbody tr'),
    searchResultPendaftaranPasien: page.locator('table tbody tr td:nth-child(5)'),
    searchResultRuanganDaftar: page.locator('table tbody tr td:nth-child(7)'),
    searchResultAsuransi: page.locator('table tbody tr td:nth-child(9)'),
});