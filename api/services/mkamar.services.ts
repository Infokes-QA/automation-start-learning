import { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiResult<T = unknown> {
	ok: boolean;
	status: number;
	url?: string;
	data?: T;
	text?: string;
}

export interface UpdateDetailCheckedRequest {
	token: string;
	ids: Array<string | number>;
}

async function parseApiResult(res: APIResponse): Promise<ApiResult> {
	const status = res.status();
	const url = res.url();
	const contentType = res.headers()['content-type'] ?? '';

	const text = await res.text().catch(() => '');
	if (contentType.includes('application/json')) {
		const data = (() => {
			try {
				return text ? JSON.parse(text) : undefined;
			} catch {
				return undefined;
			}
		})();
		return { ok: res.ok(), status, url, data, text };
	}

	return { ok: res.ok(), status, url, text };
}

/** Domain-based service for mkamar (curl-based POST). */
export class MkamarService {
	constructor(private readonly api: APIRequestContext) {}

	/**
	 * POST /mkamar/updatedetailchecked
	 * Expects urlencoded body with repeated `ids[]` and `_token`.
	 */
	async updateDetailChecked(request: UpdateDetailCheckedRequest): Promise<ApiResult> {
		const params = new URLSearchParams();
		for (const id of request.ids) {
			params.append('ids[]', String(id));
		}
		params.append('_token', request.token);

		const res = await this.api.post('/mkamar/updatedetailchecked', {
			headers: {
				'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			data: params.toString(),
		});

		return await parseApiResult(res);
	}
}
