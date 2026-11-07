import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4189';
const folder = 'artifacts/thomas/interactions';
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const results = [];
for (const width of [1440,768,390,320]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
  await page.goto(`${base}/human-story/thomas/#unless`);
  await page.getByText('What had the others already seen?', { exact: true }).click();
  await page.locator('#unless details').first().screenshot({ path: `${folder}/testimony-${width}.jpg`, quality: 80 });
  await page.goto(`${base}/human-story/thomas/#absent`);
  await page.addStyleTag({ content: 'p, a, summary, blockquote { font-size: 200% !important; }' });
  await page.getByText('Thomas before this moment', { exact: true }).click();
  await page.getByText('Sources, editions and limits', { exact: true }).click();
  const overflow = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, elements: [...document.querySelectorAll('body *')].filter(el => { const r=el.getBoundingClientRect(); return r.width && (r.right > innerWidth+1 || r.left < -1); }).map(el => ({ tag: el.tagName, class: el.getAttribute('class'), text: el.textContent?.slice(0,80), width: el.getBoundingClientRect().width })).slice(0,20) }));
  results.push(overflow);
  if (width === 320) await page.screenshot({ path: `${folder}/enlarged-320.jpg`, quality: 85 });
  await page.goto(`${base}/human-story/thomas/sayings/#comparison`);
  await page.getByText('What does the surviving Greek actually preserve?', { exact: true }).click();
  await page.locator('#comparison').screenshot({ path: `${folder}/greek-${width}.jpg`, quality: 80 });
  await page.close();
}
await writeFile(`${folder}/observations.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
await browser.close();
