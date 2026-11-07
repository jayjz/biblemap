import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4197';
const folder = 'artifacts/thomas-v4/states';
await mkdir(folder, {recursive:true});
const browser = await chromium.launch({executablePath:process.env.CHROME_PATH});
const observations = [];
try {
  for (const width of [1440,390,320]) {
    const page = await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', e=>errors.push(e.message));
    page.on('console', m=>{if(m.type()==='error') errors.push(m.text());});
    await page.goto(`${base}/human-story/thomas/#unless`);
    await page.getByRole('checkbox',{name:'Hold the two voices together',exact:true}).check();
    await page.locator('#unless').screenshot({path:`${folder}/held-${width}.jpg`,quality:80});
    await page.goto(`${base}/human-story/thomas/sayings/#witnesses`);
    for(const id of ['nhc','oxy655']) {
      await page.locator(`#inspect-${id}`).focus();
      await page.keyboard.press('Space');
      await expect(page.locator(`[data-witness="${id}"]`)).toBeVisible();
      if(width!==390) await page.locator(`[data-witness="${id}"]`).screenshot({path:`${folder}/${id}-${width}.jpg`,quality:80});
    }
    await page.locator('#inspect-oxy1').check();
    await page.getByText('Inspect the surviving ending of saying 26',{exact:true}).click();
    await page.addStyleTag({content:'p, a, summary, blockquote {font-size:200% !important}'});
    const enlargedOverflow = await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    expect(enlargedOverflow).toBe(false);
    if(width===320) await page.locator('[data-witness="oxy1"]').screenshot({path:`${folder}/greek-enlarged-320.jpg`,quality:80});
    observations.push({base,width,errors,enlargedOverflow});
    await page.close();
  }
  const page = await browser.newPage({viewport:{width:320,height:900},reducedMotion:'reduce'});
  await page.route(/\/media\/thomas\/.*\.webp$/,route=>route.abort());
  await page.goto(`${base}/human-story/thomas/#unless`);
  await expect(page.locator('[data-cinematic-frame="proximity"]')).toHaveAttribute('data-media-state','unavailable');
  await page.locator('#unless').screenshot({path:`${folder}/failed-media-320.jpg`,quality:80});
  await page.close();
  const nojs = await browser.newPage({viewport:{width:390,height:900},javaScriptEnabled:false});
  await nojs.goto(`${base}/human-story/thomas/reading/#eight-days`);
  await nojs.locator('#eight-days').screenshot({path:`${folder}/reading-nojs-390.jpg`,quality:80});
  await nojs.locator('#not-seen').screenshot({path:`${folder}/reading-ending-nojs-390.jpg`,quality:80});
  await nojs.close();
} finally { await browser.close(); }
await writeFile(`${folder}/observations.json`,JSON.stringify(observations,null,2)+'\n');
console.log(JSON.stringify(observations));
