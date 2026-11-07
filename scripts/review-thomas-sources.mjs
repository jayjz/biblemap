import { chromium } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
const folder='artifacts/thomas-source-immersion/states';await mkdir(folder,{recursive:true});
const base=process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:4197';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH});
const observations=[];
try{
 for(const width of [1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  await page.goto(`${base}/human-story/thomas/#source-traditions`);
  await page.addStyleTag({content:'p,a,summary,blockquote,dt,h3{font-size:200% !important}'});
  const outside=await page.evaluate(()=>[...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect();return r.width&&(r.right>innerWidth+1||r.left< -1);}).map(el=>({tag:el.tagName,class:el.getAttribute('class'),text:el.textContent?.slice(0,70),width:el.getBoundingClientRect().width})).slice(0,18));
  observations.push({width,outside,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  if(width===320)await page.locator('#source-traditions').screenshot({path:`${folder}/traditions-enlarged-320.jpg`,quality:82});
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:900},javaScriptEnabled:false});
 await page.goto(`${base}/human-story/thomas/reading/#source-voices`);
 await page.locator('#source-voices').screenshot({path:`${folder}/reading-nojs-390.jpg`,quality:82});await page.close();
}finally{await browser.close();}
await writeFile(`${folder}/observations.json`,JSON.stringify(observations,null,2)+'\n');console.log(JSON.stringify(observations));
