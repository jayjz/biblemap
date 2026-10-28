import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
  testDir:'./tests',testMatch:'reader-transition.spec.ts',workers:1,
  reporter:'list',outputDir:'test-results/reader',
  use:{baseURL:'http://127.0.0.1:4203',launchOptions:{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['Pixel 7']}}],
});
