// Local lab snapshot; not field Core Web Vitals or representative INP.
import { chromium } from '@playwright/test';
import { createExportServer } from '../../scripts/serve-export.mjs';
import { once } from 'node:events';
import { writeFileSync } from 'node:fs';
const server = createExportServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const rows = [];
try {
  for (const width of [1440, 390]) {
    for (const path of ['/', '/jonah/', '/human-story/thomas/', '/nineveh/']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(); const failures = [], consoleErrors = [];
      page.on('pageerror', e => consoleErrors.push(e.message));
      page.on('requestfailed', r => failures.push(`${r.url()}: ${r.failure()?.errorText}`));
      await page.addInitScript(() => {
        window.seoLab = { lcp: 0, shifts: [] };
        new PerformanceObserver(list => { for (const entry of list.getEntries()) window.seoLab.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.seoLab.shifts.push({ time: entry.startTime, value: entry.value }); }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(`${base}${path}`); await page.waitForTimeout(1500);
      const metrics = await page.evaluate(() => {
        let cls = 0, sum = 0, start = 0, previous = 0;
        for (const shift of window.seoLab.shifts) {
          if (shift.time - previous > 1000 || shift.time - start > 5000) { sum = 0; start = shift.time; }
          sum += shift.value; previous = shift.time; cls = Math.max(cls, sum);
        }
        return { lcpMs: Math.round(window.seoLab.lcp), cls, transferredScriptBytes: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'script').reduce((n, r) => n + r.transferSize, 0), documentBytes: performance.getEntriesByType('navigation')[0].transferSize };
      });
      await page.screenshot({ path: `artifacts/seo-routing/${path === '/' ? 'home' : path.split('/').filter(Boolean).join('-')}-${width}.png` });
      rows.push({ width, path, ...metrics, failures, consoleErrors }); await context.close();
    }
  }
  writeFileSync('artifacts/seo-routing/performance.json', JSON.stringify({ method: 'Single unthrottled loopback Chromium sample; reduced motion; 1.5 seconds after load; not field data; no INP measurement.', rows }, null, 2) + '\n');
  console.log(rows);
} finally { await browser.close(); server.close(); }
