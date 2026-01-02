import { expect, Page } from '@playwright/test';
import { createAuthenticatedApiClientFromPage } from '../client/apiClient';
import { getMkamarEditCsrfToken } from '../utils/get.token.helper';
import { ApiResult, MkamarService } from '../services/mkamar.services';

export interface UpdateDetailCheckedViaApiInput {
	kamarId: string | number;
	ids: Array<string | number>;
}

/**
 * Facade untuk update mengosongkan kamar yang sudah di isi via API menggunakan `page` yang sudah login.
 *
 * This reproduces the curl:
 * POST /mkamar/updatedetailchecked
 * body: ids[]=<id>&_token=<csrf>
 */
export async function updateDetailCheckedViaApi(
	page: Page,
	input: UpdateDetailCheckedViaApiInput,
): Promise<ApiResult> {
	const api = await createAuthenticatedApiClientFromPage(page);
	try {
		const token = await getMkamarEditCsrfToken(api, { kamarId: input.kamarId });
		const svc = new MkamarService(api);
		const result = await svc.updateDetailChecked({ token, ids: input.ids });

		expect(
			result.ok,
			`updateDetailChecked failed: ${result.status} ${result.url ?? ''} ${result.text ?? ''}`,
		).toBeTruthy();

		return result;
	} finally {
		await api.dispose();
	}
}
