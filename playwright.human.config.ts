import { defineConfig } from '@playwright/test';
import base from './playwright.config';

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4311);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid PLAYWRIGHT_PORT');
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  ...base,
  testMatch: '**/jonah-human.spec.ts', testIgnore: [],
  outputDir: 'test-results/human',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/human' }]],
  use: { ...base.use, baseURL },
  webServer: { command: `python3 -m http.server ${port} --bind 127.0.0.1 --directory out`, url: `${baseURL}/jonah/`, reuseExistingServer: !process.env.CI },
});
