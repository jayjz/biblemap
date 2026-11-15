import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { HOME_CURATION } from '../src/content/home-curation.ts';
import { HOME_CATALOG } from '../src/content/home-catalog.ts';
import { HOMEPAGE, homepageAvailableRoutes } from '../src/lib/homepage.ts';
import { selectedScope } from '../src/content/visitor-human-story.ts';
import { visitorMaturity } from '../src/domain/publication.ts';
const available=homepageAvailableRoutes();
const immersive=new Set(['pliny','perpetua','romanus','james','thomas','jonah','lachish']);
const inventory={
 schemaVersion:1,
 baseline:{main:'23bf774dbd38b98dd8921d33149ed4485440c223',plinyWip:'064a17ac3e7511ccb42323e436b6442f661be2cd',plinyV3:'82d5bc4308114dcc1ba8dbff71be4a0e08d8551e',plinyV4:'ae4dc1c8f5b3d585ecaa75832cf0e735a150ada9',chain:['main','feat/pliny-human-encounter','feat/pliny-v3-break-the-form (#56)','feat/pliny-v4-documentary (#57)','feat/homepage-living-archive']},
 curation:HOME_CURATION,
 entries:HOME_CATALOG.map(e=>{
  const route=e.href.split('#')[0]; const record=selectedScope.routes.find(r=>r.route===route);
  return {id:e.id,route,href:e.href,routePresent:available.has(route),visitorEligible:HOMEPAGE.discovery.some(d=>d.id===e.id),scopeEntry:e.scopeEntryId??null,maturity:e.scopeEntryId?selectedScope.entries[e.scopeEntryId]:record?.maturity,editorialRole:e.id===HOME_CURATION.hero?'hero':HOME_CURATION.featured.includes(e.id)?'featured':'discovery',form:immersive.has(e.id)?'developed-encounter':'sourced-reading-room',authoringReview:'draft',limitations:record?.limitations??[],unmergedDependency:e.id==='pliny'?'Pliny WIP → #56 → #57':null};
 }),
 routes:selectedScope.routes.map(r=>({...r,visitorEligible:visitorMaturity(r.maturity),routePresent:available.has(r.route)||existsSync(resolve('src/app',`.${r.route}`,'page.tsx'))||(/^\/human-story\/(paths|worlds)\/[a-z0-9-]+\/$/.test(r.route)&&existsSync(resolve('src/app/human-story',r.route.includes('/paths/')?'paths/[path]/page.tsx':'worlds/[world]/page.tsx'))),indexing:r.indexing??'inherited-candidate-noindex'})),
};
const serialized=JSON.stringify(inventory,null,2)+'\n';
const path='docs/homepage-v2/inventory.json';
if(process.argv.includes('--check')) {
 if(await readFile(path,'utf8')!==serialized)throw new Error('Homepage inventory is stale; run node --experimental-strip-types scripts/homepage-inventory.mjs');
 console.log(`Homepage inventory checked: ${inventory.entries.length} destinations, ${inventory.routes.length} scoped routes.`);
}else{await mkdir('docs/homepage-v2',{recursive:true});await writeFile(path,serialized);console.log(`Wrote ${path}`);}
