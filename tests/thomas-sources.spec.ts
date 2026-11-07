import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { THOMAS_SOURCES } from '../src/content/thomas';

test('source encounters connect narrative, documents and later traditions without a bibliography gate',async({page})=>{
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('/human-story/thomas/#unless');
  await expect(page.getByRole('complementary',{name:'Source for Unless I see'})).toContainText('without explaining his motives');
  await page.locator('#unless').getByRole('link',{name:'Follow the voices in this account',exact:true}).click();
  await expect(page.locator('#source-voices')).toBeFocused();
  await expect(page.locator('#source-voices')).toContainText('not individually name these speakers');
  const nav=page.getByRole('navigation',{name:'Thomas evidence'});
  await nav.getByRole('link',{name:'The Traditions',exact:true}).click();
  await expect(page.locator('#source-traditions')).toBeFocused();
  await expect(page.locator('#source-traditions')).toContainText('not two independent eyewitnesses');
  await expect(page.locator('#source-traditions')).toContainText('not a recovered route');
  await page.goBack();await expect(page).toHaveURL(/#source-voices$/);
  await page.goForward();await expect(page).toHaveURL(/#source-traditions$/);
  await nav.getByRole('link',{name:'The Questions',exact:true}).click();
  await expect(page.locator('#source-questions')).toContainText('April DeConick');
  await expect(page.locator('#source-questions')).toContainText('Simeon Burke');
  await expect(page.locator('#source-bibliography')).not.toHaveAttribute('open','');
  await page.getByText('Sources, editions and limits',{exact:true}).click();
  for(const source of THOMAS_SOURCES) await expect(page.locator(`#${source.id}`)).toBeVisible();
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.goto('/human-story/thomas/sayings/#source-traditions');
  await expect(page.locator('#source-traditions')).toContainText('M. R. James');
  await page.getByRole('link',{name:'Return to John’s ending',exact:true}).click();
  await expect(page).toHaveURL(/\/thomas\/#not-seen$/);
  expect(errors).toEqual([]);
});

test('source exploration works with no JavaScript, keyboard, reduced motion and enlarged text',async({browser,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto(`${baseURL}/human-story/thomas/#thomas-sources`);
  const questions=page.getByRole('navigation',{name:'Thomas evidence'}).getByRole('link',{name:'The Questions',exact:true});
  await questions.focus();await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#source-questions$/);
  await expect(page.locator('#source-questions')).toContainText('Whose name? Whose hand?');
  for(const id of ['source-voices','source-witnesses','source-traditions','source-questions']) await expect(page.locator(`#${id}`)).toBeVisible();
  // Inject the enlargement through the stylesheet response: addStyleTag's load event
  // never resolves with scripting disabled in this Chrome/Playwright combination.
  await page.route('**/*.css',async route=>{
    const response=await route.fetch();
    await route.fulfill({response,body:(await response.text())+'\np,a,summary,blockquote,dt,h3{font-size:200% !important}'});
  });
  await page.goto(`${baseURL}/human-story/thomas/reading/#thomas-sources`);
  await expect(page.locator('#thomas-sources img')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await context.close();
});

for(const width of [1440,768,390,320]) test(`source encounters reflow and retain all evidence with failed imagery at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
  await page.route(/\/media\/thomas\/.*\.webp$/,r=>r.abort());
  await page.goto('/human-story/thomas/#thomas-sources');
  for(const id of ['source-voices','source-witnesses','source-traditions','source-questions']){
    await page.getByRole('navigation',{name:'Thomas evidence'}).locator(`a[href="#${id}"]`).click();
    await expect(page.locator(`#${id}`)).toBeFocused();
  }
  await page.addStyleTag({content:'p, a, summary, blockquote, dt, h3 {font-size:200% !important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('#source-witnesses')).toContainText('beginning is not preserved');
  await expect(page.locator('#source-questions')).toContainText('does not establish dependence');
});
