import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const dir='artifacts/perpetua-art-direction/references';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];
try {
 for (const [name,url] of [['previous-preview','https://biblemap-cv98fpbpk-elliotandersons-projects.vercel.app/human-story/perpetua/'],['vermeer','https://www.rijksmuseum.nl/en/story/closer-to-johannes-vermeer'],['serviceberry','https://emergencemagazine.org/essay/the-serviceberry/']]) {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  try {await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000}); await page.screenshot({path:`${dir}/${name}.png`}); results.push({name,url:page.url(),title:await page.title()});}
  catch(error){results.push({name,error:String(error)});}
  await page.close();
 }
} finally {await browser.close();await writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));}
