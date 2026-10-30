import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const phase = process.argv[2] ?? 'before';
const dir = 'artifacts/reader-transition';
mkdirSync(dir, {recursive:true});
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];
try {
  for (const [width,height] of [[1440,1000],[820,1180],[390,844],[320,740]]) {
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
    page.on('requestfailed',r=>errors.push(r.url()));
    page.on('response',r=>{if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`);});
    for(const scene of ['jonah-3-mercy','jonah-4-anger']) {
      await page.goto(`http://127.0.0.1:4203/jonah/#${scene}`);
      await page.locator('[data-reader-ready=true]').waitFor();
      await page.evaluate(()=>document.fonts.ready);
      await page.locator(`#${scene} img:visible`).evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
      await page.locator(`#${scene}`).screenshot({path:`${dir}/${phase}-${width}-${scene}.png`});
      results.push({width,scene,errors:[...errors],overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
    }
    if(phase==='after' && [1440,390].includes(width)) {
      await page.locator('#jonah-4-anger .story-mercy-perspective summary').click();
      await page.locator('#jonah-4-anger .reader-margin').screenshot({path:`${dir}/interpretation-${width}.png`});
      await page.goto('http://127.0.0.1:4203/jonah/#jonah-3-mercy');
      await page.getByRole('button',{name:'Examine the Flood Tablet'}).click();
      await page.getByRole('dialog').locator('img').evaluate(image=>image.decode());
      await page.getByRole('dialog').screenshot({path:`${dir}/artifact-${width}.png`});
      await page.keyboard.press('Escape');
    }
    await page.close();
  }
} finally {await browser.close();}
writeFileSync(`${dir}/${phase}.json`,JSON.stringify(results,null,2));
if(results.some(r=>r.errors.length||r.overflow)) throw new Error('Capture diagnostics failed');
