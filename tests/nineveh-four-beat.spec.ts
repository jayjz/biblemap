import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import chapter3 from '../src/content/scripture/web-jonah-3.json';
import chapter4 from '../src/content/scripture/web-jonah-4.json';

const route = '/experiments/nineveh-four-beat/';
test('four stable encounters preserve Scripture, history and the complete reader', async ({ page }) => {
  await page.goto(route);
  await expect(page.locator('.four-beat')).toHaveAttribute('data-ready','true');
  await page.getByRole('link',{name:'Enter the passage'}).click();
  await expect(page).toHaveURL(/#mercy$/);
  await expect(page.locator('#mercy-heading')).toBeFocused();
  await expect(page.locator('#mercy [data-reference="3:10"]')).toHaveText(chapter3.verses[9].text);
  await page.getByRole('link',{name:'Read Jonah’s response'}).click();
  for (const verse of chapter4.verses.filter(v=>v.number<=4)) await expect(page.locator(`#anger [data-reference="4:${verse.number}"]`)).toHaveText(verse.text);
  await page.getByRole('link',{name:'Stay with the question'}).click();
  await page.getByText('Follow the question to the book’s ending',{exact:false}).click();
  for (const verse of chapter4.verses.filter(v=>v.number>=5)) await expect(page.locator(`#question [data-reference="4:${verse.number}"]`)).toHaveText(verse.text);
  await expect(page.locator('.fb-unanswered')).toHaveText('A question, left open.');
  await expect(page).toHaveURL(/#question\/ending$/);
  await page.reload(); await expect(page.locator('.fb-ending')).toHaveAttribute('open','');
  await page.goBack(); await expect(page).toHaveURL(/#question$/);
  await expect(page.locator('.fb-ending')).not.toHaveAttribute('open','');
  await page.goBack(); await expect(page.locator('.four-beat')).toHaveAttribute('data-beat','anger');
  await page.goForward(); await page.reload(); await expect(page.locator('.four-beat')).toHaveAttribute('data-beat','question');
  await page.getByRole('link',{name:'Continue · Jonah 4:5–11'}).click();
  await expect(page.locator('.story-root')).toHaveAttribute('data-reader-ready','true');
  await expect(page.locator('[data-scene]')).toHaveCount(13);
});

test('contextual discoveries work with keyboard, URL state and a return to Scripture', async ({ page }) => {
  for (const [beat,kind,summary] of [['mercy','world','A city that kept stories in clay'],['anger','voices','Two readings beside the anger'],['question','art','A body beneath the leaves']]) {
    await page.goto(`${route}#${beat}`);
    const trigger = page.locator(`#${beat} .fb-discovery > summary`);
    await trigger.focus(); await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`#${beat}/${kind}$`));
    await expect(page.locator(`#${beat} .fb-discovery`)).toHaveAttribute('open','');
    await expect(trigger).toContainText(summary);
    await page.reload(); await expect(page.locator(`#${beat} .fb-discovery`)).toHaveAttribute('open','');
    await page.getByRole('link',{name:'Return to Scripture'}).click();
    await expect(page.locator(`#${beat}-heading`)).toBeFocused();
    await expect(page.locator(`#${beat}-heading`)).toBeInViewport();
    await expect(page).toHaveURL(new RegExp(`#${beat}$`));
  }
  await page.goto(`${route}#mercy/world`);
  await expect(page.locator('#mercy .fb-discovery-body')).toContainText('later than Jonah’s traditional eighth-century');
  await expect(page.locator('#mercy .fb-discovery-body')).toContainText('not a record of Nineveh’s repentance');
  await expect(page.getByRole('link',{name:'Inspect the museum record'})).toHaveAttribute('href','https://www.britishmuseum.org/collection/object/W_K-3375');
  await page.goto(`${route}#anger/voices`);
  await expect(page.locator('.fb-voices section')).toHaveCount(2);
  await page.goto(`${route}#unknown/world`);
  await expect(page.locator('.four-beat')).toHaveAttribute('data-beat','city');
  await expect(page.locator('.fb-discovery[open]')).toHaveCount(0);
});

test('all treatments and viewport sizes reflow, respect reduced motion and pass automated accessibility', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror',error=>errors.push(error.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const width of [320,390,820,1440]) {
    await page.setViewportSize({width,height:900});
    for (const treatment of ['a','b','c']) {
      await page.goto(`${route}?treatment=${treatment}#mercy`);
      await expect(page.locator('.four-beat')).toHaveAttribute('data-treatment',treatment);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      expect(await page.locator('.fb-panorama').count() ? await page.locator('.fb-panorama').evaluate(el=>getComputedStyle(el).transitionDuration) : '0s').toBe('0s');
    }
  }
  for (const beat of ['city','mercy/world','anger/voices','question/art']) {
    await page.goto(`${route}#${beat}`);
    await expect(page.locator('.four-beat')).toHaveAttribute('data-ready','true');
    expect((await new AxeBuilder({page}).include('.four-beat').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('no JavaScript preserves all passages, native discoveries and the unanswered ending', async ({ browser, baseURL }) => {
  const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}});
  const page = await context.newPage();
  await page.goto(`${baseURL}${route}`);
  await expect(page.locator('.fb-scene:visible')).toHaveCount(4);
  await page.locator('#mercy .fb-discovery > summary').click();
  await expect(page.locator('#mercy .fb-discovery-body')).toBeVisible();
  await page.locator('.fb-ending > summary').click();
  await expect(page.locator('[data-reference="4:11"]')).toHaveText(chapter4.verses[10].text);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await context.close();
});

test('loading, failed imagery, still view and text view retain working Scripture', async ({ page }) => {
  let releaseImage: () => void = () => {};
  const heldImage = new Promise<void>(resolve => { releaseImage = resolve; });
  await page.route('**/four-beat-panorama.webp',async route=>{await heldImage;await route.continue();});
  await page.goto(`${route}#mercy`,{waitUntil:'domcontentloaded'});
  await expect(page.getByRole('status')).toContainText('Preparing the landscape');
  releaseImage(); await expect(page.locator('.fb-panorama')).toHaveAttribute('data-image-state','ready');
  await page.unroute('**/four-beat-panorama.webp');
  await page.route('**/four-beat-panorama.webp',route=>route.abort());
  await page.reload();
  await expect(page.getByRole('status')).toContainText('landscape is unavailable');
  await expect(page.locator('#mercy [data-reference="3:10"]')).toBeVisible();
  await page.getByRole('button',{name:'Still view',exact:true}).click();
  await expect(page.locator('.four-beat')).toHaveAttribute('data-still','true');
  expect(await page.locator('.fb-panorama').evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
  await page.getByRole('button',{name:'Text view',exact:true}).click();
  await expect(page.locator('.fb-world')).toBeHidden();
  await page.getByRole('link',{name:'Read Jonah’s response'}).click();
  await expect(page.locator('#anger [data-reference="4:2"]')).toBeVisible();
  await page.getByRole('button',{name:'Show the world'}).click();
  await expect(page.locator('.fb-world')).toBeVisible();
});
