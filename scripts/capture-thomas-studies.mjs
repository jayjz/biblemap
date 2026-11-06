import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const folder = 'artifacts/thomas/cinematic/studies';
await mkdir(folder,{recursive:true});
const browser = await chromium.launch({executablePath:process.env.CHROME_PATH});
const results=[];
for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:1000}});
  await page.goto(pathToFileURL(resolve('artifacts/thomas/cinematic/proposals.html')).href);
  await page.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
  for(const id of ['a','b']) await page.locator(`#${id}`).screenshot({path:`${folder}/${id}-${width}.jpg`,quality:85});
  results.push({width,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  await page.close();
}
await writeFile(`${folder}/observations.json`,JSON.stringify(results,null,2));
await browser.close();
