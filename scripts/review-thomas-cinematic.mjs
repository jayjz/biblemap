import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const folder='artifacts/thomas/cinematic/interactions';
await mkdir(folder,{recursive:true});
const base=process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:4189';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH});
const results=[];
const measure=page=>page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,elements:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.width&&(r.right>innerWidth+1||r.left< -1)&&el.tagName!=='path';}).map(el=>({tag:el.tagName,class:el.getAttribute('class'),width:el.getBoundingClientRect().width,text:el.textContent?.slice(0,70)})).slice(0,12)}));
for(const width of [1440,768,390,320]) {
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 await page.goto(`${base}/human-story/thomas/#unless`);
 await page.getByRole('checkbox',{name:'Hold the two voices together',exact:true}).check();
 await page.locator('#unless img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
 await page.locator('#unless').screenshot({path:`${folder}/voices-together-${width}.jpg`,quality:80});
 await page.goto(`${base}/human-story/thomas/sayings/#witnesses`);
 await page.getByRole('radio',{name:/P.Oxy. 1 Greek/}).check();
 await expect(page.locator('[data-witness="oxy1"]')).toBeVisible();
 await page.locator('[data-witness="oxy1"]').screenshot({path:`${folder}/oxy1-${width}.jpg`,quality:85});
 await page.goto(`${base}/human-story/thomas/sayings/#saying-13`);
 await page.getByText('Read the whole preserved saying 13',{exact:true}).click();
 await page.locator('#saying-13').screenshot({path:`${folder}/saying-13-${width}.jpg`,quality:80});
 const manuscript=await measure(page);
 await page.route(/\.(png|jpg|jpeg|webp|avif|svg)(\?|$)/,route=>route.abort());
 await page.goto(`${base}/human-story/thomas/`);
 await expect(page.locator('[data-cinematic-frame]').first()).toHaveAttribute('data-media-state','unavailable');
 const blocked=[];
 for(const id of ['absent','unless','eight-days','confession','not-seen']) {
   await page.locator(`nav[aria-label="Thomas movements"] a[href="#${id}"]`).click();
   blocked.push({id,...await measure(page)});
 }
 await page.addStyleTag({content:'p, a, summary, blockquote { font-size:200% !important; }'});
 await page.getByText('Sources, editions and limits',{exact:true}).click();
 const enlarged=await measure(page);
 if(width===320) await page.screenshot({path:`${folder}/blocked-enlarged-320.jpg`,quality:85});
 results.push({width,manuscript,blocked,enlarged});
 await page.close();
}
await writeFile(`${folder}/observations.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
await browser.close();
