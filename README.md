# Playwright BDD Template

Playwright + `playwright-bdd` automation project with feature-based test scenarios.

## Setup

1. Install dependencies:
   `npm i`
2. Install Playwright browser binaries (first time only):
   `npx playwright install`
3. Create `.env` and set values:
   - `BASE_URL=https://your-app-url`
   - Use one credential pair:
     - `EC_USERNAME=your-username`
     - `EC_PASSWORD=your-password`


## Project Structure

- `features/*.feature`: Gherkin scenarios
- `steps/*.ts`: step definitions
- `pages/**`: page objects
- `playwright.config.ts`: Playwright + BDD config

## Run

- Generate BDD specs: `npm run bdd:gen`
- Run all tests: `npm test`
- Run Chromium headed: `npm run test:headed`
- Run headed by tag (`@pendaftaranPasien`): `npm run test:headed:tag`

