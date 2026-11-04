import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

// BASE_URL comes from the environment so the same suite can point at a
// preview deploy without a code change. CI passes vars.BASE_URL, which is
// an empty string when unset, so this must be || and not ??.
const BASE_URL = process.env.BASE_URL || 'https://www.bbsherpa.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // The target is a live production site. One retry locally and two in CI
  // keep network blips from reading as product defects.
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'html',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // The site is mobile-first, so everything runs in both viewports.
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-iphone', use: { ...devices['iPhone 13'] } },
  ],
});
