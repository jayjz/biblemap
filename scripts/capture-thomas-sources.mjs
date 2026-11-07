import { chromium } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';

const phase=process.argv[2]??'after';
const base=process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:4197';
const folder=`artifacts/thomas-source-immersion/${phase}`;
await mkdir(folder,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH});
const observations=[];
try{for(const width of [1440,768,390,320]){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>errors.push(r.url()));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto(`${base}/human-story/thomas/#thomas-sources`);await page.evaluate(()=>document.fonts.ready);
 await page.locator('#thomas-sources').screenshot({path:`${folder}/sources-${width}.jpg`,quality:80});
 if(phase==='before'){await page.getByText('Sources, editions and limits',{exact:true}).click();await page.locator('#thomas-sources').screenshot({path:`${folder}/bibliography-${width}.jpg`,quality:75});}
 else{for(const id of ['source-voices','source-witnesses','source-traditions','source-questions'])await page.locator(`#${id}`).screenshot({path:`${folder}/${id}-${width}.jpg`,quality:82});}
 await page.goto(`${base}/human-story/thomas/#unless`);await page.locator('#unless img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));await page.locator('#unless').screenshot({path:`${folder}/moment-${width}.jpg`,quality:80});
 await page.goto(`${base}/human-story/thomas/sayings/#${phase==='before'?'thomas-sources':'source-traditions'}`);await page.locator(phase==='before'?'#thomas-sources':'#source-traditions').screenshot({path:`${folder}/sayings-traditions-${width}.jpg`,quality:80});
 observations.push({base,width,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await page.close();
}}finally{await browser.close();}
await writeFile(`${folder}/observations.json`,JSON.stringify(observations,null,2)+'\n');console.log(JSON.stringify(observations));
