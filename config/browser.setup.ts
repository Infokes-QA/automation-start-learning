import { chromium, firefox, webkit, type Browser } from "@playwright/test";
import { env } from "./env.config";

type BrowserName = "chromium" | "firefox" | "webkit";

async function getBrowser(headless?: boolean, browserName: BrowserName = "chromium"): Promise<Browser> {
  const useRemoteBrowser = env.USE_REMOTE_BROWSER;
  const playwrightServerUrl = env.PLAYWRIGHT_SERVER_URL;

  if (useRemoteBrowser && playwrightServerUrl) {
    console.log(`Connecting to remote browser at ${playwrightServerUrl}`);
    // Remote browser connections typically use chromium
    return await chromium.connect(playwrightServerUrl);
  }

  const engine = browserName === "firefox" ? firefox : browserName === "webkit" ? webkit : chromium;

  if (headless !== undefined) {
    return await engine.launch({ headless });
  } else {
    return await engine.launch();
  }
}

/**
 * Checks if remote browser connection should be used based on environment variables
 * @returns The Playwright server URL if remote browser is enabled, undefined otherwise
 */
function getRemoteBrowserUrl(): string | undefined {
  const useRemoteBrowser = env.USE_REMOTE_BROWSER;
  const playwrightServerUrl = env.PLAYWRIGHT_SERVER_URL;

  if (useRemoteBrowser && playwrightServerUrl) {
    console.log(`Remote browser enabled: ${playwrightServerUrl}`);
    return playwrightServerUrl;
  }

  return undefined;
}

export { getBrowser, getRemoteBrowserUrl };
export type { BrowserName };
