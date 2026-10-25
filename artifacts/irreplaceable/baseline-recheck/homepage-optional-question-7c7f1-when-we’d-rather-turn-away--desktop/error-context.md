# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> optional question: What do we do when we’d rather turn away?
- Location: tests\homepage.spec.ts:45:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 4

- Array []
+ Array [
+   "404 http://127.0.0.1:4192/explore/__next.explore.__PAGE__.txt?_rsc=jizhw",
+   "Failed to load resource: the server responded with a status of 404 (File not found)",
+ ]
```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - generic [ref=f1e2]:
    - link "Skip to scripture" [ref=f1e3] [cursor=pointer]:
      - /url: "#jonah-1-calling-heading"
    - banner [ref=f1e4]:
      - link "BibleMap Stories" [ref=f1e5] [cursor=pointer]:
        - /url: /
        - text: BibleMap
        - generic [aria-hidden] [ref=f1e6]: /
        - generic [ref=f1e7]: Stories
      - link "Exit to map" [ref=f1e8] [cursor=pointer]:
        - /url: /?explore=1
        - text: Exit to map
        - generic [aria-hidden] [ref=f1e9]: ↗
    - main [ref=f1e10]:
      - generic [ref=f1e11]:
        - paragraph [ref=f1e12]: The book of Jonah / A journey in six movements
        - heading "Jonah The Man Who Ran" [level=1] [ref=f1e13]:
          - text: Jonah
          - generic [ref=f1e14]: The Man Who Ran
        - paragraph [ref=f1e15]: A conversation. A responsibility. A truth about ourselves.
        - paragraph [ref=f1e16]: Sometimes, leaving feels easier.
        - generic [ref=f1e17]:
          - generic [ref=f1e18]: All four chapters
          - generic [ref=f1e19]: World English Bible
          - generic [ref=f1e20]: At your own pace · In silence
        - link "Begin reading" [ref=f1e21] [cursor=pointer]:
          - /url: "#jonah-1-calling"
          - text: Begin reading
          - generic [aria-hidden] [ref=f1e22]: ↓
      - navigation "Jonah sections" [ref=f1e23]:
        - list [ref=f1e24]:
          - listitem [ref=f1e25]:
            - link "01 Calling 1:1–2" [ref=f1e26] [cursor=pointer]:
              - /url: "#jonah-1-calling"
              - generic [ref=f1e27]: "01"
              - generic [ref=f1e28]:
                - text: Calling
                - generic [ref=f1e29]: 1:1–2
          - listitem [ref=f1e30]:
            - link "02 Flight 1:3" [ref=f1e31] [cursor=pointer]:
              - /url: "#jonah-1-escape"
              - generic [ref=f1e32]: "02"
              - generic [ref=f1e33]:
                - text: Flight
                - generic [ref=f1e34]: 1:3
          - listitem [ref=f1e35]:
            - link "03 Storm 1:4–16" [ref=f1e36] [cursor=pointer]:
              - /url: "#jonah-1-storm-wind"
              - generic [ref=f1e37]: "03"
              - generic [ref=f1e38]:
                - text: Storm
                - generic [ref=f1e39]: 1:4–16
          - listitem [ref=f1e40]:
            - link "04 Depths 1:17–2:10" [ref=f1e41] [cursor=pointer]:
              - /url: "#jonah-1-depths"
              - generic [ref=f1e42]: "04"
              - generic [ref=f1e43]:
                - text: Depths
                - generic [ref=f1e44]: 1:17–2:10
          - listitem [ref=f1e45]:
            - link "05 Nineveh Chapter 3" [ref=f1e46] [cursor=pointer]:
              - /url: "#jonah-3-return"
              - generic [ref=f1e47]: "05"
              - generic [ref=f1e48]:
                - text: Nineveh
                - generic [ref=f1e49]: Chapter 3
          - listitem [ref=f1e50]:
            - link "06 The unanswered question Chapter 4" [ref=f1e51] [cursor=pointer]:
              - /url: "#jonah-4-anger"
              - generic [ref=f1e52]: "06"
              - generic [ref=f1e53]:
                - text: The unanswered question
                - generic [ref=f1e54]: Chapter 4
      - article [ref=f1e55]:
        - generic [ref=f1e56]:
          - generic [ref=f1e57]:
            - paragraph [ref=f1e58]: Chapter 01 / 01 of 13
            - heading "Calling" [active] [level=2] [ref=f1e59]
            - paragraph [ref=f1e60]: Jonah 1:1–2
          - generic [aria-hidden] [ref=f1e61]: "01"
        - generic [ref=f1e62]:
          - 'region "Scripture: Jonah 1:1–2" [ref=f1e64]':
            - paragraph [ref=f1e65]: Scripture / World English Bible
            - generic [ref=f1e66]:
              - paragraph [ref=f1e67]:
                - superscript [ref=f1e68]: "1"
                - text: Now the LORD’s word came to Jonah the son of Amittai, saying,
              - paragraph [ref=f1e69]:
                - superscript [ref=f1e70]: "2"
                - text: “Arise, go to Nineveh, that great city, and preach against it, for their wickedness has come up before me.”
          - complementary "Scene artwork" [ref=f1e71]:
            - figure "The Prophets Hosea and Jonah Raphael · c. 1510 About this artwork & rights" [ref=f1e72]:
              - img "Brown ink drawing of two robed prophets with a winged figure between them; transfer grid and collector stamps remain visible." [ref=f1e73]
              - generic [ref=f1e74]:
                - paragraph [ref=f1e75]:
                  - text: The Prophets Hosea and Jonah
                  - generic [ref=f1e76]: Raphael · c. 1510
                - group [ref=f1e77]:
                  - generic "About this artwork & rights" [ref=f1e78] [cursor=pointer]
        - group [ref=f1e79]:
          - generic "Explore further Sources, reading notes & private reflection" [ref=f1e80] [cursor=pointer]
        - navigation "Calling scene navigation" [ref=f1e81]:
          - generic [ref=f1e82]: Begin here
          - generic [ref=f1e83]: 1 / 13
          - link "Continue" [ref=f1e84] [cursor=pointer]:
            - /url: "#jonah-1-escape"
            - text: Continue
            - generic [aria-hidden] [ref=f1e85]: →
    - contentinfo [ref=f1e86]:
      - generic [ref=f1e87]: BibleMap · Scripture, place, reflection
      - link "Explore the map ↗" [ref=f1e88] [cursor=pointer]:
        - /url: /?explore=1
  - alert [ref=f1e89]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import AxeBuilder from "@axe-core/playwright";
  3   | 
  4   | test("homepage introduces Jonah and clearly distinguishes future journeys", async ({ page }, testInfo) => {
  5   |   const errors: string[] = [];
  6   |   const external: string[] = [];
  7   |   page.on("pageerror", e => errors.push(e.message));
  8   |   page.on("request", request => { if (new URL(request.url()).hostname !== "127.0.0.1") external.push(request.url()); });
  9   |   await page.goto("/");
  10  |   await expect(page.getByRole("heading", { level: 1 })).toContainText("Questions that stay with us.");
  11  |   await expect(page.getByRole("link", { name: "Enter the story" })).toHaveAttribute("href", "/jonah/#jonah-1-calling");
  12  |   await expect(page.getByRole("link", { name: /Explore the biblical world/ }).first()).toHaveAttribute("href", "/explore/");
  13  |   await expect(page.getByText("Future journey · Not yet available")).toHaveCount(4);
  14  |   await expect(page.locator("canvas")).toHaveCount(0);
  15  |   await page.screenshot({ path: testInfo.outputPath("homepage.png"), fullPage: true });
  16  |   await expect(page.getByRole("link", { name: "Enter the story" })).toBeVisible();
  17  |   await page.getByRole("link", { name: "Enter the story" }).click();
  18  |   await expect(page).toHaveURL(/\/jonah\/#jonah-1-calling$/);
  19  |   await expect(page.locator("[data-reader-ready=true]")).toBeVisible();
  20  |   await expect(page.locator("[data-scene=jonah-1-calling]")).toBeVisible();
  21  |   await expect(page.locator('[data-reference="1:1"]')).toBeInViewport();
  22  |   expect(errors).toEqual([]);
  23  |   expect(external).toEqual([]);
  24  | });
  25  | 
  26  | test("homepage reflows and respects reduced motion", async ({ page }, testInfo) => {
  27  |   await page.emulateMedia({ reducedMotion: "reduce" });
  28  |   await page.goto("/");
  29  |   for (const width of [320, 390, 768, 1440]) {
  30  |     await page.setViewportSize({ width, height: 840 });
  31  |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  32  |     await page.screenshot({ path: testInfo.outputPath(`homepage-${width}.png`), fullPage: true });
  33  |   }
  34  |   await page.keyboard.press("Tab");
  35  |   await expect(page.locator(".bm-skip")).toBeFocused();
  36  | });
  37  | 
  38  | const doors = [
  39  |   { question: "What do we do when we’d rather turn away?", invitation: "Jonah’s story begins with a call" },
  40  |   { question: "What happens when our choices reach beyond us?", invitation: "A journey across the sea" },
  41  |   { question: "Why can mercy be hard to offer?", invitation: "Carry that question with you" },
  42  | ];
  43  | 
  44  | for (const door of doors) {
  45  |   test(`optional question: ${door.question}`, async ({ page }, testInfo) => {
  46  |     const errors: string[] = [];
  47  |     page.on("pageerror", error => errors.push(error.message));
  48  |     page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  49  |     page.on("requestfailed", request => {
  50  |       if (request.failure()?.errorText !== "net::ERR_ABORTED") errors.push(request.url());
  51  |     });
  52  |     page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  53  |     await page.goto("/");
  54  |     const radios = page.getByRole("radio");
  55  |     await expect(radios).toHaveCount(3);
  56  |     for (const radio of await radios.all()) await expect(radio).not.toBeChecked();
  57  |     // Wait for hydration by exercising two choices, ending on the requested one.
  58  |     await radios.last().check();
  59  |     await expect(radios.last()).toBeChecked();
  60  |     const requests: string[] = [];
  61  |     page.on("request", request => requests.push(request.url()));
  62  |     const initialState = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage }, url: location.href }));
  63  |     const radio = page.getByRole("radio", { name: door.question, exact: true });
  64  |     await radio.check();
  65  |     await expect(radio).toBeChecked();
  66  |     await expect(page.locator(".bm-invitation")).toContainText(door.invitation);
  67  |     expect(await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage }, url: location.href }))).toBe(initialState);
  68  |     expect(requests).toEqual([]);
  69  |     await page.screenshot({ path: testInfo.outputPath("selected.png"), fullPage: true });
  70  |     await page.getByRole("link", { name: "Enter the story" }).click();
  71  |     await expect(page).toHaveURL(/\/jonah\/#jonah-1-calling$/);
  72  |     await expect(page.locator("[data-reader-ready=true]")).toBeVisible();
  73  |     await expect(page.locator("[data-scene=jonah-1-calling]")).toBeVisible();
  74  |     await expect(page.locator('[data-reference="1:1"]')).toBeInViewport();
> 75  |     expect(errors).toEqual([]);
      |                    ^ Error: expect(received).toEqual(expected) // deep equality
  76  |   });
  77  | }
  78  | 
  79  | test("question keyboard navigation, reset, and narrow mobile", async ({ page }, testInfo) => {
  80  |   await page.emulateMedia({ reducedMotion: "reduce" });
  81  |   await page.goto("/");
  82  |   await page.keyboard.press("Tab");
  83  |   await expect(page.locator(".bm-skip")).toBeFocused();
  84  |   await page.keyboard.press("Tab");
  85  |   await page.keyboard.press("Tab");
  86  |   await page.keyboard.press("Tab");
  87  |   const first = page.getByRole("radio").first();
  88  |   await expect(first).toBeFocused();
  89  |   await page.screenshot({ path: testInfo.outputPath("keyboard-focus.png"), fullPage: true });
  90  |   await page.keyboard.press("Space");
  91  |   await expect(first).toBeChecked();
  92  |   await page.keyboard.press("ArrowDown");
  93  |   await expect(page.getByRole("radio").nth(1)).toBeChecked();
  94  |   await expect(page.getByRole("radio").nth(1)).toBeFocused();
  95  |   await page.keyboard.press("Tab");
  96  |   await expect(page.getByRole("link", { name: "Enter the story" })).toBeFocused();
  97  |   await page.reload();
  98  |   for (const radio of await page.getByRole("radio").all()) await expect(radio).not.toBeChecked();
  99  |   await page.setViewportSize({ width: 320, height: 700 });
  100 |   await page.screenshot({ path: testInfo.outputPath("narrow-default.png"), fullPage: true });
  101 |   for (const door of doors) {
  102 |     await page.getByRole("radio", { name: door.question, exact: true }).check();
  103 |     await expect(page.locator(".bm-invitation")).toContainText(door.invitation);
  104 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  105 |     await expect(page.getByRole("link", { name: "Enter the story" })).toBeVisible();
  106 |   }
  107 |   await page.screenshot({ path: testInfo.outputPath("narrow-selected.png"), fullPage: true });
  108 |   expect((await new AxeBuilder({ page }).include(".bm-home").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  109 | });
  110 | 
  111 | test("story entry remains available without JavaScript", async ({ browser, baseURL }) => {
  112 |   const context = await browser.newContext({ javaScriptEnabled: false });
  113 |   const page = await context.newPage();
  114 |   await page.goto(`${baseURL}/`);
  115 |   await expect(page.locator(".bm-invitation")).toContainText("Begin with Jonah");
  116 |   await page.getByRole("link", { name: "Enter the story" }).click();
  117 |   await expect(page).toHaveURL(/\/jonah\/#jonah-1-calling$/);
  118 |   await expect(page.locator('[data-reference="1:1"]')).toBeInViewport();
  119 |   await context.close();
  120 | });
  121 | 
  122 | test("homepage entry, reload, history, and direct reader visits keep their destinations", async ({ page }, testInfo) => {
  123 |   await page.emulateMedia({ reducedMotion: "reduce" });
  124 |   await page.goto("/");
  125 |   await page.getByRole("link", { name: "Enter the story" }).focus();
  126 |   await page.keyboard.press("Enter");
  127 |   await expect(page.locator("#jonah-1-calling-heading")).toBeFocused();
  128 |   await expect(page.locator('[data-reference="1:1"]')).toBeInViewport();
  129 |   await expect(page.locator(".story-intro")).not.toBeInViewport();
  130 |   await page.screenshot({ path: testInfo.outputPath("homepage-scripture-entry.png") });
  131 |   await page.getByRole("link", { name: "Continue" }).click();
  132 |   await expect(page).toHaveURL(/#jonah-1-escape$/);
  133 |   await page.goBack();
  134 |   await expect(page.locator("#jonah-1-calling-heading")).toBeFocused();
  135 |   await page.goBack();
  136 |   await expect(page).toHaveURL(/\/$/);
  137 |   await page.goForward();
  138 |   await expect(page.locator('[data-reference="1:1"]')).toBeInViewport();
  139 |   await page.reload();
  140 |   await expect(page.locator("#jonah-1-calling-heading")).toBeFocused();
  141 |   await expect(page.locator('[data-reference="1:1"]')).toBeInViewport();
  142 |   await page.goto("/jonah/");
  143 |   await expect(page.locator(".story-intro")).toBeInViewport();
  144 |   await page.getByRole("link", { name: "Begin reading" }).focus();
  145 |   await page.keyboard.press("Enter");
  146 |   await expect(page.locator("#jonah-1-calling-heading")).toBeFocused();
  147 |   await page.goto("/jonah/#jonah-3-return");
  148 |   await expect(page.locator(".story-root")).toHaveAttribute("data-active-scene", "jonah-3-return");
  149 | });
  150 | 
  151 | test("homepage skip link remains on stories instead of opening legacy atlas", async ({ page }) => {
  152 |   await page.goto("/");
  153 |   await expect(page.locator(".bm-home")).toBeVisible();
  154 |   await page.locator(".bm-skip").focus();
  155 |   await page.keyboard.press("Enter");
  156 |   await expect(page).toHaveURL(/\/#main-content$/);
  157 |   await expect(page.locator("#main-content")).toBeVisible();
  158 |   await expect(page.getByRole("link", { name: "Enter the story" })).toBeVisible();
  159 |   await expect(page.locator(".bm-home")).toBeVisible();
  160 |   await expect(page.locator("canvas")).toHaveCount(0);
  161 |   await page.reload();
  162 |   await expect(page.locator(".bm-home")).toBeVisible();
  163 | });
  164 | 
```