import type { Locator, Page, FrameLocator } from '@playwright/test';

export type RetryOptions = {
	retries?: number;
	baseDelayMs?: number;
	maxDelayMs?: number;
	timeoutMs?: number;
};

export type ActionOptions = {
	timeoutMs?: number;
	retry?: RetryOptions;
};

export type DialogRole = 'dialog' | 'alertdialog';

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown): boolean {
	const msg = String((error as any)?.message ?? error ?? '');

	// Common transient Playwright/browser issues.
	return (
		msg.includes('Timeout') ||
		msg.includes('Target closed') ||
		msg.includes('Page closed') ||
		msg.includes('Execution context was destroyed') ||
		msg.includes('most likely because of a navigation') ||
		msg.includes('net::ERR_ABORTED') ||
		msg.includes('net::ERR_FAILED') ||
		msg.includes('net::ERR_CONNECTION') ||
		msg.includes('Navigation failed') ||
		msg.includes('Element is not attached to the DOM')
	);
}

function nextDelay(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
	const delay = baseDelayMs * Math.pow(2, attempt);
	return Math.min(delay, maxDelayMs);
}

export class BasePage {
	protected readonly page: Page;

	// Default set untuk wait dan retry
	protected readonly defaultTimeoutMs = 30_000;
	protected readonly defaultRetry: RetryOptions = {
		retries: 2,
		baseDelayMs: 250,
		maxDelayMs: 1_500,
	};

	constructor(page: Page) {
		this.page = page;
	}

	// ---- Dialog helpers

	/**
	 * Untuk mengambil element didalam dialog. gunakan anchor untuk menandai dialog yang dimaksud
	 */
	getDialogContaining(anchor: Locator, role: DialogRole = 'dialog'): Locator {
		return this.page.getByRole(role).filter({ has: anchor });
	}

	/**
	 * Memastikan dialog yang berisi `anchor` terlihat, lalu menjalankan `fn` yang di-scoped ke dialog tersebut.
	 */
	async withDialogContaining<T>(
		anchor: Locator,
		fn: (dialog: Locator) => Promise<T>,
		options?: { role?: DialogRole; timeoutMs?: number },
	): Promise<T> {
		const dialog = this.getDialogContaining(anchor, options?.role ?? 'dialog');
		await this.waitVisible(dialog, options?.timeoutMs);
		return await fn(dialog);
	}

	/**
	 * Mengklik target di dalam dialog yang berisi `anchor`.
	 */
	async clickInDialogContaining(
		anchor: Locator,
		target: (dialog: Locator) => Locator,
		options?: ActionOptions & { role?: DialogRole },
	): Promise<void> {
		const dialog = this.getDialogContaining(anchor, options?.role ?? 'dialog');
		await this.click(target(dialog), options);
	}

	/**
	 * Mengisi target di dalam dialog yang berisi `anchor`.
	 */
	async fillInDialogContaining(
		anchor: Locator,
		target: (dialog: Locator) => Locator,
		value: string,
		options?: ActionOptions & { role?: DialogRole; clearFirst?: boolean },
	): Promise<void> {
		const dialog = this.getDialogContaining(anchor, options?.role ?? 'dialog');
		await this.fill(target(dialog), value, options);
	}

	/**
	 * Memastikan dialog terbuka dengan mengklik trigger button jika diperlukan.
	 * Berguna untuk flow dimana ada button perantara yang harus diklik untuk membuka dialog.
	 */
	async ensureDialogOpenByClickingTrigger(options: {
		dialogAnchor: Locator;
		triggerButton?: Locator;
		timeoutMs?: number;
	}): Promise<void> {
		const { dialogAnchor, triggerButton, timeoutMs = 10_000 } = options;

		// Jika dialog sudah terbuka, langsung return
		if (await this.tryWaitVisible(dialogAnchor.first(), 500)) return;

		// Tutup dropdown yang mungkin menghalangi
		await this.page.keyboard.press('Escape').catch(() => {});
		await this.page.waitForTimeout(100);

		// Klik trigger button jika ada dan visible
		if (triggerButton && await this.tryWaitVisible(triggerButton.first(), 2_000)) {
			await this.click(triggerButton.first(), { timeoutMs: 5_000, retry: { retries: 0 } }).catch(() => {});
		}

		// Tunggu dialog anchor muncul
		await this.waitVisible(dialogAnchor.first(), timeoutMs);
	}

	protected async focus(target: Locator, timeoutMs?: number): Promise<void> {
		const timeout = timeoutMs ?? this.defaultTimeoutMs;
		try {
			await target.scrollIntoViewIfNeeded({ timeout });
		} catch {
			// ignore
		}
		try {
			await target.focus({ timeout });
		} catch {
			// ignore
		}
	}

	static escapeRegExp(value: string): string {
		return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	protected async retry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T> {
		const retries = options?.retries ?? this.defaultRetry.retries ?? 0;
		const baseDelayMs = options?.baseDelayMs ?? this.defaultRetry.baseDelayMs ?? 0;
		const maxDelayMs = options?.maxDelayMs ?? this.defaultRetry.maxDelayMs ?? baseDelayMs;

		let lastError: unknown;
		for (let attempt = 0; attempt <= retries; attempt += 1) {
			try {
				return await fn();
			} catch (err) {
				lastError = err;
				if (attempt >= retries || !isRetryableError(err)) {
					throw err;
				}
				await sleep(nextDelay(attempt, baseDelayMs, maxDelayMs));
			}
		}

		throw lastError;
	}

	// ---- Wait helpers

	async waitVisible(target: Locator, timeoutMs?: number): Promise<void> {
		await target.waitFor({ state: 'visible', timeout: timeoutMs ?? this.defaultTimeoutMs });
	}

	async tryWaitVisible(target: Locator, timeoutMs = 1_500): Promise<boolean> {
		try {
			await target.waitFor({ state: 'visible', timeout: timeoutMs });
			return true;
		} catch {
			return false;
		}
	}

	async waitHidden(target: Locator, timeoutMs?: number): Promise<void> {
		await target.waitFor({ state: 'hidden', timeout: timeoutMs ?? this.defaultTimeoutMs });
	}

	async waitAttached(target: Locator, timeoutMs?: number): Promise<void> {
		await target.waitFor({ state: 'attached', timeout: timeoutMs ?? this.defaultTimeoutMs });
	}

	async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load', timeoutMs?: number): Promise<void> {
		await this.page.waitForLoadState(state, { timeout: timeoutMs ?? this.defaultTimeoutMs });
	}

	/**
	 * wait untuk populated data
	 */
	async waitForPopulated(targetToBeReady?: Locator, timeoutMs = 10_000, settleDelayMs = 500): Promise<void> {
		await this.page.waitForLoadState('networkidle', { timeout: timeoutMs }).catch(() => {});
		if (settleDelayMs > 0) {
			await this.page.waitForTimeout(settleDelayMs);
		}
		if (targetToBeReady) {
			await this.waitVisible(targetToBeReady, timeoutMs);
		}
	}

	// ---- Action helpers (with retry)

	async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'; timeoutMs?: number; retry?: RetryOptions }): Promise<void> {
		const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
		await this.retry(async () => {
			await this.page.goto(url, { waitUntil: options?.waitUntil ?? 'load', timeout: timeoutMs });
		}, options?.retry);
	}

	async click(target: Locator, options?: ActionOptions & { force?: boolean }): Promise<void> {
		const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
		await this.retry(async () => {
			await this.waitVisible(target, timeoutMs);
			await this.focus(target, timeoutMs);
			await target.click({ timeout: timeoutMs, force: options?.force });
		}, options?.retry);
	}

	async dblclick(target: Locator, options?: ActionOptions): Promise<void> {
		const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
		await this.retry(async () => {
			await this.waitVisible(target, timeoutMs);
			await this.focus(target, timeoutMs);
			await target.dblclick({ timeout: timeoutMs });
		}, options?.retry);
	}

	async fill(target: Locator, value: string, options?: ActionOptions & { clearFirst?: boolean }): Promise<void> {
		const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
		await this.retry(async () => {
			await this.waitVisible(target, timeoutMs);
			await this.focus(target, timeoutMs);
			if (options?.clearFirst) {
				await target.fill('', { timeout: timeoutMs });
			}
			await target.fill(value, { timeout: timeoutMs });
		}, options?.retry);
	}

	async press(target: Locator, key: string, options?: ActionOptions): Promise<void> {
		const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
		await this.retry(async () => {
			await this.waitVisible(target, timeoutMs);
			await this.focus(target, timeoutMs);
			await target.press(key, { timeout: timeoutMs });
		}, options?.retry);
	}

	async check(target: Locator, options?: ActionOptions): Promise<void> {
		const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
		await this.retry(async () => {
			await this.waitVisible(target, timeoutMs);
			await this.focus(target, timeoutMs);
			await target.check({ timeout: timeoutMs });
		}, options?.retry);
	}

	async selectOptionByLabel(target: Locator, label: string, options?: ActionOptions): Promise<void> {
		const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
		await this.retry(async () => {
			await this.waitVisible(target, timeoutMs);
			await this.focus(target, timeoutMs);
			await target.selectOption({ label }, { timeout: timeoutMs });
		}, options?.retry);
	}

	async selectOptionByValue(target: Locator, value: string, options?: ActionOptions): Promise<void> {
		const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
		await this.retry(async () => {
			await this.waitVisible(target, timeoutMs);
			await this.focus(target, timeoutMs);
			await target.selectOption({ value }, { timeout: timeoutMs });
		}, options?.retry);
	}

	frame(selector: string): FrameLocator {
		return this.page.frameLocator(selector);
	}
}
