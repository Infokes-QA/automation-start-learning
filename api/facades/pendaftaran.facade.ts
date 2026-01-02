import { expect, Page } from '@playwright/test';
import { createAuthenticatedApiClientFromPage } from '../client/apiClient';
import { PendaftaranService, ApiResult } from '../services/pendaftaran.services';
import { getPendaftaranShowCsrfToken } from '../utils/get.token.helper';

export interface DestroyPendaftaranViaApiInput {
	pendaftaranId: string | number;
	passwordOtorisasi: string;
	keteranganDelete: string;
	token?: string;
}

/**
 * Facade untuk menghapus (destroy) pendaftaran via API menggunakan `page` yang sudah login.
 * Reproduces the curl: POST /pendaftaran/destroy (x-www-form-urlencoded).
 */
export async function destroyPendaftaranViaApi(
	page: Page,
	input: DestroyPendaftaranViaApiInput,
): Promise<ApiResult> {
	const api = await createAuthenticatedApiClientFromPage(page);
	try {
		const token = input.token ?? (await getPendaftaranShowCsrfToken(api, { pendaftaranId: input.pendaftaranId }));
		const refererPath = `/pendaftaran/show/${input.pendaftaranId}`;
		const svc = new PendaftaranService(api);
		const result = await svc.destroyPendaftaran(
			{
				id: input.pendaftaranId,
				passwordOtorisasi: input.passwordOtorisasi,
				keteranganDelete: input.keteranganDelete,
				token,
			},
			{ refererPath },
		);

		expect(
			result.ok,
			`destroyPendaftaran failed: ${result.status} ${result.url ?? ''} ${result.text ?? ''}`,
		).toBeTruthy();

		return result;
	} finally {
		await api.dispose();
	}
}
