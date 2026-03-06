# Playwright BDD Login Template

Minimal template project for login automation with Playwright + `playwright-bdd`.

## Setup

1. Install dependencies:
   `npm install`
2. Configure `.env`:
   `BASE_URL=https://your-app-url`
   `LOGIN_USERNAME=your-username`
   `LOGIN_PASSWORD=your-password`

`EC_USERNAME` and `EC_PASSWORD` are also supported for backward compatibility.

## Run

- Run tests: `npm test`
- Run in headed mode: `npm run test:headed`
- List generated tests: `npm run test:list`
