import { expect, Page } from '@playwright/test';
import { createAuthenticatedApiClientFromPage } from '../client/apiClient';
import { ApiResult, PendaftaranService } from '../services/pendaftaran.services';
import { getPasienCreateFormInfo } from '../utils/get.token.helper';
import { generatePasienData, GeneratedPasienData } from '../testdata/pasien.faker';

export type CreatedPasien = GeneratedPasienData;

export interface CreatePasienViaApiOutput {
  pasien: CreatedPasien;
  result: ApiResult;
}

/**
 * Facade untuk membuat pasien via API menggunakan `page` yang sudah login.
 * Untuk memudahkan penulisan step definitions tanpa harus menulis logika API secara langsung(lebih pendek dan rapi).
 */
export async function createPasienViaApi(
  page: Page,
  overrides?: Partial<GeneratedPasienData> & {
    asuransiId?: string;
    noKk?: string;
    noAsuransi?: string;

  },
): Promise<CreatedPasien> {
  const out = await createPasienViaApiWithResult(page, overrides);
  return out.pasien;
}

/**
 * Variant yang mengembalikan data pasien yang dibuat DAN hasil API mentah.
 * Gunakan ini ketika Anda membutuhkan ID/field tambahan dari respons server.
 */
export async function createPasienViaApiWithResult(
  page: Page,
  overrides?: Partial<GeneratedPasienData> & {
    asuransiId?: string;
    noKk?: string;
    noAsuransi?: string;
  },
): Promise<CreatePasienViaApiOutput> {
  const pasien = generatePasienData(overrides);

  const api = await createAuthenticatedApiClientFromPage(page);
  try {
    const { token, action, method } = await getPasienCreateFormInfo(api);
    if (method && method.toUpperCase() !== 'POST') {
      throw new Error(`Unexpected pasien create form method: ${method} (action: ${action ?? ''})`);
    }
    const svc = new PendaftaranService(api);

    const result = await svc.registerPasien(
      {
        token,
        nik: pasien.nik,
        nama: pasien.nama,
        tanggalLahir: pasien.tanggalLahir,
        jenisKelamin: pasien.jenisKelamin,
        tempatLahir: pasien.tempatLahir,
        asuransiId: overrides?.asuransiId ?? '0000',
        noKk: overrides?.noKk,
        noAsuransi: overrides?.noAsuransi,
      },
      { path: action },
    );

    expect(
      result.ok,
      `Create pasien failed: ${result.status} ${result.url ?? ''} ${result.text ?? ''}`,
    ).toBeTruthy();

    return { pasien, result };
  } finally {
    await api.dispose();
  }
}
