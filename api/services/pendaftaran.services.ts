import { APIRequestContext, APIResponse } from '@playwright/test';
import { buildPasienStorePayload, PasienStorePayloadInput } from '../payloads/pendaftaran.payload';

export interface ApiResult<T = unknown> {
	ok: boolean;
	status: number;
	url?: string;
	data?: T;
	text?: string;
}

export type RegisterPasienRequest = PasienStorePayloadInput;

export interface DestroyPendaftaranRequest {
	id: string | number;
	passwordOtorisasi: string;
	keteranganDelete: string;
	token: string;
}

// Debug helpers for logging API payloads
function shouldDebugApiPayloads(): boolean {
	const v = process.env.DEBUG_API_PAYLOADS;
	return v === '1' || v?.toLowerCase() === 'true' || v?.toLowerCase() === 'yes';
}

function includePiiInDebugLogs(): boolean {
	const v = process.env.DEBUG_API_PAYLOADS_INCLUDE_PII;
	return v === '1' || v?.toLowerCase() === 'true' || v?.toLowerCase() === 'yes';
}

function maskValue(value: string): string {
	if (!value) return value;
	if (value.length <= 8) return '***';
	return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

function sanitizePasienStoreFormForLog(form: Record<string, string>): Record<string, string> {
	const includePii = includePiiInDebugLogs();
	const redacted: Record<string, string> = {};

	for (const [key, value] of Object.entries(form)) {
		if (key === '_token') {
			redacted[key] = maskValue(value);
			continue;
		}
		// NIK + patient name as PII.
		if (!includePii && (key === 'MPasien[nik]' || key === 'MPasien[nama]' || key === 'MPasien[no_hp]' || key === 'MPasien[email]')) {
			redacted[key] = maskValue(value);
			continue;
		}
		redacted[key] = value;
	}

	return redacted;
}

function debugLogPasienStorePayload(path: string, form: Record<string, string>): void {
	if (!shouldDebugApiPayloads()) return;
	const safeForm = sanitizePasienStoreFormForLog(form);
	// eslint-disable-next-line no-console
	console.log(`[api] POST ${path} form payload:`, safeForm);
}

// API proses dimulai disini
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

/** Domain-based service for pendaftaran/pasien (curl-based POST only). */
export class PendaftaranService {
	constructor(private readonly api: APIRequestContext) {}

	/**
	 * POST /pasien/store (matches the curl you provided).
	 * must provide the CSRF token in `request.token`.
	 */
	async registerPasien(request: RegisterPasienRequest, options?: { path?: string }): Promise<ApiResult> {
		const form = buildPasienStorePayload(request);
		const path = options?.path ?? '/pasien/store';
		debugLogPasienStorePayload(path, form);
		const res = await this.api.post(path, { form });
		return await parseApiResult(res);
	}

	/**
	 * POST /pasien/store
	 * Must include `_token`.
	 */
	async postPasienStoreForm(form: Record<string, string>): Promise<ApiResult> {
		debugLogPasienStorePayload('/pasien/store', form);
		const res = await this.api.post('/pasien/store', { form });
		return await parseApiResult(res);
	}

	/**
	 * POST /pendaftaran/destroy
	 * Expects x-www-form-urlencoded body with: id, password_otorisasi, keterangan_delete, _token.
	 */
	async destroyPendaftaran(
		request: DestroyPendaftaranRequest,
		options?: { path?: string; refererPath?: string },
	): Promise<ApiResult> {
		const params = new URLSearchParams();
		params.append('id', String(request.id));
		params.append('password_otorisasi', request.passwordOtorisasi);
		params.append('keterangan_delete', request.keteranganDelete);
		params.append('_token', request.token);

		const path = options?.path ?? '/pendaftaran/destroy';
		const res = await this.api.post(path, {
			headers: {
				'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
				...(options?.refererPath ? { referer: options.refererPath } : {}),
			},
			data: params.toString(),
		});

		return await parseApiResult(res);
	}
}

