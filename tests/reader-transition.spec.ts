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

test('missing environmental and artifact images keep text and sources available',async ({page})=>{
  await page.route('**/reader-panorama.webp',r=>r.abort());
  await page.route('**/flood-tablet.webp',r=>r.abort());
  await page.goto('/jonah/#jonah-3-mercy');
  await expect(page.locator('#jonah-3-mercy .reader-environment-fallback')).toBeVisible();
  await page.getByRole('button',{name:'Examine the Flood Tablet'}).click();
  await expect(page.getByRole('dialog')).toContainText('Photograph unavailable');
  await expect(page.getByRole('link',{name:'Read the museum object record'})).toBeVisible();
});
