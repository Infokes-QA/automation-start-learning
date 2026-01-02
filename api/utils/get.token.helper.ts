import { APIRequestContext } from '@playwright/test';

export interface PasienCreateFormInfo {
	token: string;
	action?: string;
	method?: string;
}

function extractCsrfTokenFromHtml(html: string, contextLabel: string): string {
	const tokenMatch = html.match(/name=["']_token["'][^>]*value=["']([^"']+)["']/i);
	if (!tokenMatch?.[1]) {
		throw new Error(`CSRF token (_token) not found in ${contextLabel} HTML`);
	}
	return tokenMatch[1];
}

function extractPasienCreateFormInfoFromHtml(html: string): PasienCreateFormInfo {
	// Find the form by looking for the NIK input as anchor.
	const anchorIndex = html.search(/name=["']MPasien\[nik\]["']/i);
	const searchIndex = anchorIndex >= 0 ? anchorIndex : html.search(/name=["']_token["']/i);

	if (searchIndex < 0) {
		throw new Error('Unable to locate pasien create form in /pasien/create HTML');
	}

	const before = html.slice(0, searchIndex);
	const formOpenMatch = [...before.matchAll(/<form\b[^>]*>/gi)].at(-1);
	if (!formOpenMatch?.index) {
		throw new Error('Unable to locate <form> tag for pasien create form');
	}
	const formStart = formOpenMatch.index;
	const afterFormStart = html.slice(formStart);
	const closeIndexInAfter = afterFormStart.search(/<\/form>/i);
	if (closeIndexInAfter < 0) {
		throw new Error('Unable to locate </form> closing tag for pasien create form');
	}
	const formHtml = afterFormStart.slice(0, closeIndexInAfter + '</form>'.length);

	const formTag = formOpenMatch[0];
	const action = formTag.match(/\baction=["']([^"']+)["']/i)?.[1];
	const method = formTag.match(/\bmethod=["']([^"']+)["']/i)?.[1];

	const tokenMatch = formHtml.match(/name=["']_token["'][^>]*value=["']([^"']+)["']/i);
	if (!tokenMatch?.[1]) {
		throw new Error('CSRF token (_token) not found inside pasien create form');
	}

	return { token: tokenMatch[1], action, method };
}

function normalizeActionToPath(action: string | undefined): string | undefined {
	if (!action) return undefined;
	try {
		const url = new URL(action);
		return `${url.pathname}${url.search}`;
	} catch {
		return action.startsWith('/') ? action : `/${action}`;
	}
}

/**
 * Get Laravel CSRF token dengan memuat HTML form create pasien.
 * TIDAK menavigasi halaman UI; menggunakan APIRequestContext yang diberikan.
 */
export async function getPasienCreateCsrfToken(
	api: APIRequestContext,
	options?: { path?: string },
): Promise<string> {
	const path = options?.path ?? '/pasien/create';
	const res = await api.get(path, {
		headers: {
			accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		},
	});

	if (!res.ok()) {
		const text = await res.text().catch(() => '');
		throw new Error(`Failed to load ${path} for CSRF token. Status: ${res.status()} Body: ${text}`);
	}

	const html = await res.text();
	return extractPasienCreateFormInfoFromHtml(html).token;
}

/**
 * Get Laravel CSRF token dengan memuat HTML form edit mkamar.
 * Digunakan untuk POST /mkamar/updatedetailchecked.
 */
export async function getMkamarEditCsrfToken(
	api: APIRequestContext,
	options: { kamarId: string | number },
): Promise<string> {
	const path = `/mkamar/edit/${options.kamarId}`;
	const res = await api.get(path, {
		headers: {
			accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			referer: path,
		},
	});

	if (!res.ok()) {
		const text = await res.text().catch(() => '');
		throw new Error(`Failed to load ${path} for CSRF token. Status: ${res.status()} Body: ${text}`);
	}

	const html = await res.text();
	return extractCsrfTokenFromHtml(html, path);
}

/**
 * Get Laravel CSRF token dengan memuat HTML halaman show pendaftaran.
 * Digunakan untuk POST /pendaftaran/destroy.
 */
export async function getPendaftaranShowCsrfToken(
	api: APIRequestContext,
	options: { pendaftaranId: string | number },
): Promise<string> {
	const path = `/pendaftaran/show/${options.pendaftaranId}`;
	const res = await api.get(path, {
		headers: {
			accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			referer: path,
		},
	});

	if (!res.ok()) {
		const text = await res.text().catch(() => '');
		throw new Error(`Failed to load ${path} for CSRF token. Status: ${res.status()} Body: ${text}`);
	}

	const html = await res.text();
	return extractCsrfTokenFromHtml(html, path);
}

/**
 * Loads /pasien/create and extracts CSRF token plus form action/method.
 * Useful for posting to the exact endpoint the UI form uses.
 */
export async function getPasienCreateFormInfo(
	api: APIRequestContext,
	options?: { path?: string },
): Promise<PasienCreateFormInfo> {
	const path = options?.path ?? '/pasien/create';
	const res = await api.get(path, {
		headers: {
			accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		},
	});

	if (!res.ok()) {
		const text = await res.text().catch(() => '');
		throw new Error(`Failed to load ${path} for CSRF token. Status: ${res.status()} Body: ${text}`);
	}

	const html = await res.text();
	const info = extractPasienCreateFormInfoFromHtml(html);
	return {
		...info,
		action: normalizeActionToPath(info.action),
	};
}

