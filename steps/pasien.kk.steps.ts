import { createBdd } from 'playwright-bdd';
import { PasienKkPage } from '../pages/pasienKk/pasien.kk.page';
import { createPasienViaApi} from '../api/facades/pasien.facade';
import { pasienData } from '../data/pendaftaran.data';
import {PendaftaranPasienPage} from '../pages/pendaftaranPasien/pendaftaran.pasien.page';
import { updateDetailCheckedViaApi } from '../api/facades/mkamar.facade';
import { pickUniqueRandomBpjsNumbers } from '../utils/testdata/random.bpjs.number';
import {
    resolvePendaftaranExpectedName,
    resolvePendaftaranSearchValue,
} from '../utils/pendaftaran/pendaftaran.search.resolve';

const { Given, When, Then, Before } = createBdd();
let pasienKkPage: PasienKkPage;
let pendaftaranPasienPage: PendaftaranPasienPage;

Before(async ({ page }) => {
    pasienKkPage = new PasienKkPage(page);
    pendaftaranPasienPage = new PendaftaranPasienPage(page);
    pasienData.createdPasien = null;
    pasienData.bpjsNumber = null;
	pasienData.lastSearchKeyword = null;
    pasienData.lastSelectedPatientName = null;

});

Given('user in pendaftaran pasien & kk page', async ({ page }) => {
    
    await pasienKkPage.bukaHalamanPasienKk();
});

When('user already have pasien {string} with asuransi {string}', async ({ page }, gender: string, asuransitype: string) => {
    if (!pasienData.createdPasien) {
        const asuransiId= asuransitype.toLowerCase() === 'umum' ? '0000' : '0001';
        const jenisKelamin = gender.toLowerCase() === 'laki-laki' ? 'L' : 'P';
        pasienData.createdPasien = await createPasienViaApi(page, { asuransiId: asuransiId, jenisKelamin });
    }
});

When('user search pasien asuransi umum with {string}', async ({ page }, key: string) => {
    const nikToSearch =
        pasienData.createdPasien && (key === '<nik>' || key === 'nik') ? pasienData.createdPasien.nik : key;

    const waitKey =
        pasienData.createdPasien && (key === '<nik>' || key === 'nik') ? pasienData.createdPasien.nama : nikToSearch;

	pasienData.lastSearchKeyword = waitKey;

    await pasienKkPage.isiNIKPasien(nikToSearch);
    await pasienKkPage.cariDanTungguHasil(nikToSearch, waitKey);
});
When('user select pasien from search result', async ({ page }) => {
    const keyword = pasienData.lastSearchKeyword ?? pasienData.createdPasien?.nama;
    if (!keyword) {
        throw new Error('Tidak ada keyword untuk memilih pasien dari hasil pencarian. Pastikan step search dijalankan terlebih dahulu.');
    }
    await pasienKkPage.menujuDetailPasien(keyword);
});

Then('user will be directed to pasien detail page', async ({ page }) => {
    await pasienKkPage.validasiHalamanDetailPasien();
    if (!pasienData.lastSelectedPatientName) {
        pasienData.lastSelectedPatientName = pasienData.createdPasien?.nama ?? (await pasienKkPage.tryAmbilNamaPasienDiHalamanDetail());
    }
});
Given('user in the pasien detail page', async ({ page }) => {
    await pasienKkPage.validasiHalamanDetailPasien();
});

When('user clicks pendaftaran button', async ({ page }) => {
    await pasienKkPage.klikTombolPendaftaran();
});


When('user selects {string} in the Status field', async ({ page }, status: string) => {
    await pasienKkPage.pilihStatusKunjungan(status);
	await pasienKkPage.tandaiCkgJikaMuncul();
});

When('user selects {string} as the Asuransi', async ({ page }, asuransi: string) => {
    await pasienKkPage.pilihAsuransi(asuransi);
});

When('user selects {string} as the Instalasi', async ({ page }, instalasi: string) => {
    await pasienKkPage.pilihInstalasi(instalasi);
});

When('user selects the Poli {string}', async ({ page }, poli: string) => {
    await pasienKkPage.pilihPoli(poli);
});

When('user selects the Jadwal Dokter {string}', async ({ page }, jadwalDokter: string) => {
    await pasienKkPage.pilihJadwalDokter(jadwalDokter);
});

When('user clicks the Simpan button', async ({ page }) => {
    await pasienKkPage.isiNoHpPasienPendaftaran('081234567890');
    await pasienKkPage.isiTinggiBeratBadanJikaKosong();
	await pasienKkPage.tungguFormPendaftaranSiapDisimpan();
    await pasienKkPage.tungguTombolSimpanAktif();
    
    await pasienKkPage.click(pasienKkPage.element.buttonSimpan);
	await pasienKkPage.tutupBPJSDialogJikaMuncul();

});

Then('user should see a success message', async ({ page }) => {
    const allow = (process.env.ALLOW_TOAST_ERROR_AS_WARNING ?? '').toLowerCase();
    const allowAsWarning = allow === '1' || allow === 'true' || allow === 'yes';
    await pasienKkPage.validasiPesanSuksesPendaftaran(90_000, { allowErrorToastAsWarning: allowAsWarning });
});

When('user navigates to the Pendaftaran Pasien', async ({ page }) => {
    await pendaftaranPasienPage.menujuFormPendaftaranPasien();
});

When('user inputs \'{string}\' in the search field', async ({ page }, patientName: string) => {
	await pendaftaranPasienPage.isiNamaPasien(resolvePendaftaranSearchValue(patientName, pasienData));
});

When('user clicks the Cari button', async ({ page }) => {
    await pendaftaranPasienPage.klikTombolCari();
});
    

Then('Ruangan daftar should be {string}', async ({ page }, ruangan: string) => {
    await pendaftaranPasienPage.verifikasiHasilPencarianRuangan(ruangan);
});

Then('Asuransi should be {string}', async ({ page }, asuransi: string) => {
    await pendaftaranPasienPage.verifikasiHasilPencarianAsuransi(asuransi);
});

Then('patient registration data should be visible with name {string}', async ({page}, key: string) => {
	await pendaftaranPasienPage.verifikasiHasilPencarianNama(resolvePendaftaranExpectedName(key, pasienData));
})

When('user inputs {string} in the search field', async ({ page }, key: string) => {
    await pendaftaranPasienPage.isiNamaPasien(resolvePendaftaranSearchValue(key, pasienData));
})

When('user selects bed type {string}', async ({ page }, bed: string) => {
    await pasienKkPage.pilihBed(bed);
})

When('user selects kamar {string}', async ({ page }, kamar: string) => {
    await updateDetailCheckedViaApi(page, { kamarId: 222, ids: [1093] });
    await pasienKkPage.pilihKamar(kamar);
})

When('user confirms deletion', async ({page}) => {
    await pasienKkPage.confirmDeletionPendaftaran();
  
})

When('user inputs keterangan {string} for deletion', async ({ page }, keterangan: string) => {
    await pasienKkPage.inputKeteranganHapus(keterangan);
})

When('user inputs password otorisasi', async ({page}) => {
    const otorisasi = process.env.EC_PASSWORD || '';
    await pasienKkPage.inputPasswordOtorisasi(otorisasi);
  
})

When('user clicks the Hapus Semua Pemeriksaan button', async ({page}) => {
  await pasienKkPage.clickHapusPermanen();
  await pasienKkPage.clickKonfirmasiHapusSemuaPemeriksaan();
})

When('user clicks the Hapus Permanen button', async ({page}) => {
  await pasienKkPage.clickDropHapus();
})

When('user input available BPJS number', async ({ page }) => {
    let lastError: unknown;
	const candidates = pickUniqueRandomBpjsNumbers(6);
    for (const candidate of candidates) {
        try {
            await pasienKkPage.inputBPJSNumber(candidate);
            pasienData.bpjsNumber = await pasienKkPage.element.bpjsNumberField.inputValue();
            return;
        } catch (err) {
            lastError = err;
        }
    }

	throw new Error(
		`Gagal input BPJS number (sudah coba ${candidates.length} nomor random). Last error: ${String(
			(lastError as any)?.message ?? lastError ?? '',
		)}`,
	);
})

When('user search pasien asuransi BPJS with {string}', async ({page}, BPJSNumber: string) => {
    let bpjsToSearch = BPJSNumber;
    if (BPJSNumber === '<BPJSNumberJalan>' || BPJSNumber === 'BPJSNumberJalan') {
        bpjsToSearch = pasienData.BPJSNumberJalan;
    } else if (BPJSNumber === '<BPJSNumberInap>' || BPJSNumber === 'BPJSNumberInap') {
        bpjsToSearch = pasienData.BPJSNumberInap;
    }

    pasienData.lastSearchKeyword = bpjsToSearch;

    await pasienKkPage.isiNIKPasien(bpjsToSearch);
    await pasienKkPage.cariDanTungguHasil(bpjsToSearch, bpjsToSearch);
})

