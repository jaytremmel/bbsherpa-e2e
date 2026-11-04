import { test, expect } from '@playwright/test';
import { HelperBase } from '../page-objects/helperBase';
import { ROUTES } from '../test-data';

// specs/smoke.md: SM-1 (200), SM-2 (main heading), SM-3 (no console errors).
// One test per route; the route table lives in test-data.ts.
for (const { path, heading } of ROUTES) {
  test(`SM: ${path} returns 200, renders its heading, logs no errors`, async ({ page, context }) => {
    await HelperBase.blockThirdPartyTraffic(context);
    const errors = HelperBase.collectPageErrors(page);

    const response = await page.goto(path);
    expect(response?.status(), 'SM-1: route responds 200').toBe(200);

    await expect(
      page.getByRole('heading', { name: heading }).first(),
      'SM-2: main heading is visible'
    ).toBeVisible();

    expect(errors, 'SM-3: no page or console errors').toEqual([]);
  });
}
