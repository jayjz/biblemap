import { test, expect } from "@playwright/test";

test("ordinary continuation exposes setting, stakes, consequences and source boundaries", async ({ page, baseURL }) => {
  const errors: string[] = [];
  const failures: string[] = [];
  const external: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("requestfailed", request => failures.push(request.url()));
  page.on("request", request => { if (baseURL && !request.url().startsWith(baseURL)) external.push(request.url()); });
  await page.goto("/human-story/perpetua/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Perpetua & Felicity");
  await expect(page.locator("header").filter({ has: page.getByRole("heading", { level: 1 }) })).toContainText("One is nursing a son");
  const begin = page.getByRole("link", { name: "Begin in Carthage", exact: true });
  await begin.focus();
  await page.keyboard.press("Enter");
  const movements = [
    { id: "carthage", next: "The child", facts: ["provincial capital", "about twenty-two", "Felicity is pregnant and enslaved", "preparing for Christian baptism", "does not tell us who denounced them"] },
    { id: "child", next: "The hearing", facts: ["Tertius and Pomponius", "nurses her hungry son", "permission for him to remain"] },
    { id: "tribunal", next: "The separation", facts: ["family’s standing", "sacrifice for the emperors", "pray for emperors but refuse sacrifice", "I am a Christian.", "condemns the prisoners to the beasts"] },
    { id: "separation", next: "Felicity", facts: ["His reason is not given", "Relief is not a reunion"] },
    { id: "felicity", next: "The vision", facts: ["narrator says pregnant women cannot be executed", "left behind", "gives birth to a daughter", "Another Christian woman", "through the narrator's telling"] },
    { id: "vision", next: "The ending", facts: ["dangerous ladder", "Dinocrates", "expectation of victory", "not the events of the public games"] },
    { id: "handover", facts: ["The attributed writing ends here", "Saturus", "wild cow", "killed with the sword", "not Perpetua reporting her own death", "scholars dispute", "Neither child’s later life is told here"] },
  ];
  for (const movement of movements) {
    const scene = page.locator(`[data-scene="${movement.id}"]`);
    await expect(page).toHaveURL(new RegExp(`#perpetua-${movement.id}$`));
    await expect(page.locator(`#title-${movement.id}`)).toBeFocused();
    for (const fact of movement.facts) await expect(scene.getByText(fact, { exact: false }).first()).toBeVisible();
    // Essential context must be in the default reading, outside any disclosure.
    expect(await scene.locator("details[open]").count()).toBe(0);
    const heading = await page.locator(`#title-${movement.id}`).boundingBox();
    const rail = await page.getByRole("navigation", { name: "Scenes in Perpetua and Felicity" }).boundingBox();
    expect(heading && rail && heading.y >= rail.y + rail.height).toBeTruthy();
    const current = await page.getByRole("navigation", { name: "Scenes in Perpetua and Felicity" }).locator('[aria-current="step"]').boundingBox();
    expect(current && rail && current.x >= rail.x - 1 && current.x + current.width <= rail.x + rail.width + 1).toBeTruthy();
    if (movement.next) await scene.getByRole("link", { name: `Continue: ${movement.next}`, exact: true }).click();
  }
  const ending = page.locator('[data-scene="handover"]');
  await expect(ending.getByRole("heading", { name: /Whose voice survives/ })).toBeVisible();
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
  expect(external).toEqual([]);
});

test("source inspection offers a keyboard return to the exact reading", async ({ page }) => {
  await page.goto("/human-story/perpetua/#perpetua-child");
  await page.locator('[data-scene="child"]').getByRole("link", { name: "Image & source", exact: true }).click();
  await expect(page.locator("#source-prison-art")).toHaveAttribute("open", "");
  const back = page.getByRole("button", { name: "Return to the story", exact: true });
  await back.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#perpetua-child$/);
  await expect(page.locator("#title-child")).toBeFocused();
  await page.getByRole("link", { name: "Read the whole story", exact: true }).click();
  await page.locator('[data-scene="child"]').getByRole("link", { name: "Image & source", exact: true }).click();
  await page.getByRole("button", { name: "Return to the story", exact: true }).click();
  await expect(page).toHaveURL(/#perpetua-all$/);
  await expect(page.locator("#all-scenes-title")).toBeFocused();
});
