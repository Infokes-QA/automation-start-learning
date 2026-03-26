import dotenv from "dotenv";

// Load environment variables once at module initialization
dotenv.config({ debug: false, quiet: true });

/**
 * Centralized environment configuration
 * All environment variables are loaded here and exported as constants
 */
export const env = {
  // Application URLs
  BASE_URL: process.env.BASE_URL ?? "https://dev-1.eclinic.id",

  // Authentication credentials
  EC_USERNAME: process.env.EC_USERNAME ?? "",
  EC_PASSWORD: process.env.EC_PASSWORD ?? "",
  EC_PASSWORD_AUTH: process.env.EC_PASSWORD_AUTH ?? "",
  EC_FASKES: process.env.EC_FASKES ?? "",

  // Browser configuration
  HEADLESS: process.env.HEADLESS !== "false",
  BROWSER: (process.env.BROWSER ?? "chromium").toLowerCase() as "chromium" | "firefox" | "webkit",

  // Remote browser configuration
  USE_REMOTE_BROWSER: process.env.USE_REMOTE_BROWSER === "1",
  PLAYWRIGHT_SERVER_URL: process.env.PLAYWRIGHT_SERVER_URL
} as const;
