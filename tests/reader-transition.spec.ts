import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('existing navigation, optional close examination, and facing interpretation', async ({page}) => {
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/jonah/#jonah-3-mercy');
  const mercy=page.locator('#jonah-3-mercy');
  await expect(mercy).toHaveClass(/reader-transition/);
  await expect(mercy.locator('[data-reference="3:10"]')).toContainText('God saw their works');
  // No discovery is necessary to follow the narrative.
  await mercy.getByRole('link',{name:'Read Jonah’s response'}).click();
  await expect(page.locator('#jonah-4-anger-heading')).toBeFocused();
  await expect(page.locator('#jonah-4-anger .story-verses p')).toHaveCount(4);
  const note=page.locator('#jonah-4-anger .story-mercy-perspective');
  await expect(note).not.toHaveAttribute('open','');
  await note.locator('summary').focus(); await page.keyboard.press('Enter');
  await expect(note).toContainText('not his commentary on Jonah');
  expect((await new AxeBuilder({page}).include('#jonah-4-anger').analyze()).violations).toEqual([]);
  await page.goBack();
  const trigger=mercy.getByRole('button',{name:'Examine the Flood Tablet'});
  await trigger.focus();
  const before=await page.evaluate(()=>scrollY);
  await page.keyboard.press('Enter');
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button',{name:'Return to reading'})).toBeFocused();
  await dialog.getByRole('button',{name:'Enlarge the writing'}).click();
  await expect(dialog.getByRole('button',{name:'Fit whole object'})).toHaveAttribute('aria-pressed','true');
  const imageRegion=dialog.getByRole('region',{name:'Tablet image; scroll to examine when enlarged'});
  await imageRegion.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(()=>imageRegion.evaluate(element=>element.scrollLeft)).toBeGreaterThan(0);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  expect(Math.abs(await page.evaluate(()=>scrollY)-before)).toBeLessThan(2);
  expect(errors).toEqual([]);
});

test('no JavaScript retains all thirteen scenes and all 48 verses',async ({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();await page.goto('/jonah/');
  await expect(page.locator('.story-scene')).toHaveCount(13);
  await expect(page.locator('.story-verses [data-reference]')).toHaveCount(48);
  await expect(page.getByRole('link',{name:'View the tablet photograph'})).toBeVisible();
  await context.close();
});

test('missing artifact image keeps Scripture, geographic orientation and sources available',async ({page})=>{
  await page.route('**/flood-tablet.webp',r=>r.abort());
  await page.goto('/jonah/#jonah-3-mercy');
  await expect(page.locator('#jonah-3-mercy .reader-image-fallback')).toBeVisible();
  await expect(page.locator('#jonah-3-mercy [data-reference="3:10"]')).toContainText('God saw their works');
  await expect(page.getByRole('img',{name:'Nineveh beside the Tigris'})).toBeVisible();
  await page.getByRole('button',{name:'Examine the Flood Tablet'}).click();
  await expect(page.getByRole('dialog')).toContainText('Photograph unavailable');
  await expect(page.getByRole('link',{name:'Read the museum object record'})).toBeVisible();
});

test('chapter turn enhances navigation only when motion and browser support allow it', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/jonah/#jonah-3-mercy');
  await expect(page.locator('[data-reader-ready=true]')).toBeVisible();
  const supportsTransitions=await page.evaluate(()=>typeof document.startViewTransition==='function');
  expect(supportsTransitions).toBe(true);
  await page.locator('#jonah-3-mercy').getByRole('link',{name:'Read Jonah’s response'}).click();
  await expect(page.locator('#jonah-4-anger-heading')).toBeFocused();
  await expect(page.locator('#jonah-4-anger [data-reference="4:1"]')).toBeInViewport();
  await page.evaluate(async()=>{await Promise.all(document.getAnimations().map(animation=>animation.finished));});
  await page.goBack();
  await expect(page.locator('#jonah-3-mercy-heading')).toBeFocused();
  // The preferred cut must not call even a supported API.
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(()=>{document.startViewTransition=()=>{throw new Error('Reduced motion called the animation API');};});
  await page.getByRole('link',{name:'Read Jonah’s response'}).click();
  await expect(page.locator('#jonah-4-anger-heading')).toBeFocused();
  await page.goBack();
  // Unsupported browsers retain the same links, focus and history behavior.
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>Object.defineProperty(document,'startViewTransition',{value:undefined,configurable:true}));
  await page.getByRole('link',{name:'Read Jonah’s response'}).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#jonah-4-anger-heading')).toBeFocused();
  await expect(page.locator('#jonah-4-anger .reader-place a').first()).toHaveAttribute('href','/explore/?place=nineveh&from=jonah-4-anger');
});

test('responsive compositions keep a readable measure and no generated-image dependency',async ({page})=>{
  const requests:string[]=[];
  page.on('request',request=>requests.push(request.url()));
  for (const width of [320,390,820,1440]) {
    await page.setViewportSize({width,height:1000});
    for (const scene of ['jonah-3-mercy','jonah-4-anger']) {
      await page.goto(`/jonah/#${scene}`);
      await expect(page.locator('[data-reader-ready=true]')).toBeVisible();
      const verse=page.locator(`#${scene} .story-verses p`).first();
      const box=await verse.boundingBox();
      expect(box?.width).toBeGreaterThan(Math.min(width-40,500));
      expect(box?.width).toBeLessThan(660);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if (scene==='jonah-3-mercy') {
        const turn=page.locator('.reader-turn');
        await turn.scrollIntoViewIfNeeded();
        const turnBox=await turn.boundingBox();
        const objectBox=await page.locator('.reader-artifact').boundingBox();
        expect(turnBox && objectBox).toBeTruthy();
        if (turnBox && objectBox) {
          if (width>850) expect(objectBox.y+objectBox.height).toBeLessThanOrEqual(turnBox.y);
          else expect(turnBox.y+turnBox.height).toBeLessThanOrEqual(objectBox.y);
        }
      }
      expect((await new AxeBuilder({page}).include(`#${scene}`).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    }
  }
  expect(requests.filter(url=>url.includes('reader-panorama'))).toEqual([]);
});
