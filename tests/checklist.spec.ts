import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

// specs/checklist.md: CL-1 through CL-8. These run against the live site and
// stay read-only: the only state they touch is the browser's own localStorage,
// which is where the page persists checked items. Each test gets a fresh
// context, so every run starts with nothing checked and no filters applied.

// A couple of always-present items, by (part of) their label text.
const PHOTO_ID = /photo id/i;
const KEYS = /^keys/i;

// One representative extra item for each situation filter, present only while
// that filter is enabled.
const FILTERS = [
  { name: 'Tailgating', button: /tailgating/i, query: '?tailgate=true', item: /grill \+ propane/i },
  { name: 'Cold Game', button: /cold game/i, query: '?cold=true', item: /moisture-wicking base layer/i },
  { name: 'Kids', button: /kids/i, query: '?kids=true', item: /ear protection for young kids/i },
];

test.describe('gameday checklist', () => {
  test('CL-1: checking an item shows it as checked', async ({ page, context }) => {
    const pm = new PageManager(page, context);
    await pm.setup();
    await pm.checklistPage.goto();

    await expect(pm.checklistPage.item(PHOTO_ID)).not.toBeChecked();
    await pm.checklistPage.checkItem(PHOTO_ID);
    await expect(pm.checklistPage.item(PHOTO_ID)).toBeChecked();
  });

  test('CL-2: a reload keeps checked items checked', async ({ page, context }) => {
    const pm = new PageManager(page, context);
    await pm.setup();
    await pm.checklistPage.goto();

    await pm.checklistPage.checkItem(PHOTO_ID);
    await pm.checklistPage.reload();
    await expect(pm.checklistPage.item(PHOTO_ID)).toBeChecked();
  });

  test('CL-3: unchecking an item and reloading shows it unchecked', async ({ page, context }) => {
    const pm = new PageManager(page, context);
    await pm.setup();
    await pm.checklistPage.goto();

    // Check and persist, then uncheck and persist, to prove the unchecked
    // state survives rather than just an item that was never checked.
    await pm.checklistPage.checkItem(PHOTO_ID);
    await pm.checklistPage.reload();
    await expect(pm.checklistPage.item(PHOTO_ID)).toBeChecked();

    await pm.checklistPage.uncheckItem(PHOTO_ID);
    await pm.checklistPage.reload();
    await expect(pm.checklistPage.item(PHOTO_ID)).not.toBeChecked();
  });

  test('CL-4: the progress line tracks checked and unchecked items', async ({ page, context }) => {
    const pm = new PageManager(page, context);
    await pm.setup();
    await pm.checklistPage.goto();

    // Read the total once so the test survives seasonal changes to the list.
    const { checked, total } = await pm.checklistPage.readProgress();
    expect(checked).toBe(0);

    await pm.checklistPage.checkItem(PHOTO_ID);
    await pm.checklistPage.expectProgress(1, total);

    await pm.checklistPage.checkItem(KEYS);
    await pm.checklistPage.expectProgress(2, total);

    await pm.checklistPage.uncheckItem(PHOTO_ID);
    await pm.checklistPage.expectProgress(1, total);
  });

  test('CL-5: Reset appears only when something is checked', async ({ page, context }) => {
    const pm = new PageManager(page, context);
    await pm.setup();
    await pm.checklistPage.goto();

    await expect(pm.checklistPage.resetButton).toBeHidden();
    await pm.checklistPage.checkItem(PHOTO_ID);
    await expect(pm.checklistPage.resetButton).toBeVisible();
    await pm.checklistPage.uncheckItem(PHOTO_ID);
    await expect(pm.checklistPage.resetButton).toBeHidden();
  });

  test('CL-6: Reset unchecks every item', async ({ page, context }) => {
    const pm = new PageManager(page, context);
    await pm.setup();
    await pm.checklistPage.goto();

    const { total } = await pm.checklistPage.readProgress();
    await pm.checklistPage.checkItem(PHOTO_ID);
    await pm.checklistPage.checkItem(KEYS);
    await pm.checklistPage.expectProgress(2, total);

    await pm.checklistPage.reset();

    await pm.checklistPage.expectProgress(0, total);
    await expect(pm.checklistPage.item(PHOTO_ID)).not.toBeChecked();
    await expect(pm.checklistPage.item(KEYS)).not.toBeChecked();
    await expect(pm.checklistPage.resetButton).toBeHidden();
  });

  for (const filter of FILTERS) {
    test(`CL-7: the ${filter.name} filter shows and hides its extra items`, async ({ page, context }) => {
      const pm = new PageManager(page, context);
      await pm.setup();
      await pm.checklistPage.goto();

      await expect(pm.checklistPage.item(filter.item)).toBeHidden();
      await pm.checklistPage.toggleFilter(filter.button);
      await expect(pm.checklistPage.item(filter.item)).toBeVisible();
      await pm.checklistPage.toggleFilter(filter.button);
      await expect(pm.checklistPage.item(filter.item)).toBeHidden();
    });

    test(`CL-8: ${filter.query} starts with the ${filter.name} filter enabled`, async ({ page, context }) => {
      const pm = new PageManager(page, context);
      await pm.setup();
      await pm.checklistPage.goto(filter.query);

      // The targeted filter's extra item is present on load...
      await expect(pm.checklistPage.item(filter.item)).toBeVisible();
      // ...while the other filters' extra items stay hidden.
      for (const other of FILTERS) {
        if (other.name === filter.name) continue;
        await expect(pm.checklistPage.item(other.item)).toBeHidden();
      }
    });
  }
});
