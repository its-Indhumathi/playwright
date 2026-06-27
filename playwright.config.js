import { devices } from '@playwright/test';

const config = ({
  testDir: './tests',
  timeout: 30 * 1000, // default
  expect: {
    timeout: 15 * 1000,
  },
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  use: {
    baseURL: 'https://rahulshettyacademy.com',
    browserName: 'chromium',
    headless: process.env.CI ? true : false,
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
});

module.exports = config;