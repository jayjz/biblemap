// Chrome evidence; generated-environment screenshots stay local, cropped discoveries are reviewable.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve('artifacts/nineveh-depth');
const base = `http://127.0.0.1:${process.env.EXPERIMENT_PORT ?? 4194}`;
mkdirSync(`${root}/local-scenes`, { recursive: true });
mkdirSync(`${root}/screenshots`, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const failures = [];
try {
  for (const [device, width, height] of [['desktop',1440,1000],['mobile',390,844],['narrow',320,700]]) {
    const page = await browser.newPage({ viewport:{width,height}, reducedMotion:'reduce', deviceScaleFactor:1, hasTouch: device !== 'desktop', isMobile: device !== 'desktop' });
    page.on('pageerror', error => failures.push(error.message));
    page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
    page.on('requestfailed', request => failures.push(request.url()));
    page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    for (const beat of ['city','mercy','anger','question']) {
      await page.goto(`${base}/experiments/nineveh/#${beat}`);
      await page.locator('[data-environment="ready"]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({path:`${root}/local-scenes/${device}-${beat}.png`,fullPage:true});
    }
    for (const discovery of ['world','art','voices']) {
      await page.goto(`${base}/experiments/nineveh/#anger`);
      const entrance = page.locator(`#discover-${discovery}`);
      if (device === 'desktop') await entrance.click();
      else await entrance.tap();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor();
      if (discovery !== 'voices') await dialog.getByRole('button',{name:'Examine larger'}).waitFor();
      await dialog.evaluate(el => { el.scrollTop = 0; });
      await dialog.screenshot({path:`${root}/screenshots/${device}-${discovery}.png`});
      if (discovery === 'voices') {
        await dialog.getByRole('button',{name:'Pope Francis',exact:true}).click();
        await dialog.screenshot({path:`${root}/screenshots/${device}-francis.png`});
      }
      await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
      await dialog.screenshot({path:`${root}/screenshots/${device}-${discovery}-lower.png`});
      const close = dialog.getByRole('button',{name:'Return to passage'});
      if (device === 'desktop') await close.click();
      else await close.tap();
    }
    await page.goto(`${base}/experiments/nineveh/#mercy`);
    await page.getByRole('button',{name:'Text view',exact:true}).click();
    await page.evaluate(() => window.scrollTo(0,0));
    await page.screenshot({path:`${root}/screenshots/${device}-encounter-text.png`,fullPage:true});
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync(`${root}/capture-results.json`, JSON.stringify({ viewports:['1440×1000','390×844','320×700'], browser:'Chrome', reducedMotion:true, touchOpenAndClose:['390×844','320×700'], failures, note:'Only cropped discovery and text-view screenshots are shared. Generated landscape stays local.' },null,2));
if (failures.length) throw new Error(JSON.stringify(failures));
console.log('Captured 12 local scene views and 24 shareable review screenshots; no console, page or network failures.');
