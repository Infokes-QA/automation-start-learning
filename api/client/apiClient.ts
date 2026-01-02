import { APIRequestContext, Page, request as playwrightRequest } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export interface CreateApiClientOptions {
	baseURL?: string;
	extraHTTPHeaders?: Record<string, string>;
}

function getBaseURLFromPageOrEnv(page: Page, baseURL?: string): string {
	if (baseURL) return baseURL;

	const currentUrl = page.url();
	const pageOrigin = currentUrl && currentUrl !== 'about:blank' ? new URL(currentUrl).origin : undefined;

	const envBaseUrl = process.env.BASE_URL;
	if (envBaseUrl) {
		// Handle kalo base utl nya http tapi appnya udah pindah ke https.
		if (pageOrigin) {
			try {
				const envUrl = new URL(envBaseUrl);
				const pageUrl = new URL(pageOrigin);
				if (envUrl.host === pageUrl.host && envUrl.protocol !== pageUrl.protocol) {
					return pageOrigin;
				}
			} catch {
				// fall back kalo base URL tidak valid.
			}
		}
		return envBaseUrl;
	}

	if (pageOrigin) return pageOrigin;

	throw new Error('Base URL is not available. Set BASE_URL env var or pass baseURL explicitly.');
}

/**
 * Creates APIRequestContext yg share cookies dan localStorage dengan Page.
 */
export async function createAuthenticatedApiClientFromPage(
	page: Page,
	options?: CreateApiClientOptions,
): Promise<APIRequestContext> {
	// Playwright may record API calls into trace/network artifacts under test-results.
	// On some Windows setups this directory may not exist yet, causing ENOENT at dispose().
	try {
		fs.mkdirSync(path.join(process.cwd(), 'test-results', '.playwright-artifacts-0', 'traces'), { recursive: true });
	} catch {
		// best-effort only
	}

	const storageState = await page.context().storageState();
	const baseURL = getBaseURLFromPageOrEnv(page, options?.baseURL);

	return await playwrightRequest.newContext({
		baseURL,
		storageState,
		extraHTTPHeaders: {
			accept: 'application/json, text/javascript, */*; q=0.01',
			'x-requested-with': 'XMLHttpRequest',
			...options?.extraHTTPHeaders,
		},
	});
}

