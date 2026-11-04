import { test } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

// specs/planner.md: PL-1 through PL-4. The forecast API is mocked in every
// test here; its real behavior is covered in tests/forecast-api.spec.ts.
test.describe('planner wizard', () => {
  test('PL-1: completing the wizard shows the plan', async ({ page, context }) => {
    const pm = new PageManager(page, context);
    await pm.setup();
    await pm.plannerPage.mockForecast();
    await pm.plannerPage.goto();
    await pm.plannerPage.completeWizard();
    await pm.plannerPage.expectResults();
  });

  test('PL-2, PL-3: a failed forecast shows the error and Try Again recovers', async ({ page, context }) => {
    const pm = new PageManager(page, context);
    await pm.setup();
    await pm.plannerPage.mockForecastFailure();
    await pm.plannerPage.goto();
    await pm.plannerPage.completeWizard();
    await pm.plannerPage.expectForecastError();
    await pm.plannerPage.tryAgain();
    await pm.plannerPage.expectWizardAtStart();
  });

  test('PL-4: Start Over returns to the first step', async ({ page, context }) => {
    const pm = new PageManager(page, context);
    await pm.setup();
    await pm.plannerPage.mockForecast();
    await pm.plannerPage.goto();
    await pm.plannerPage.completeWizard();
    await pm.plannerPage.expectResults();
    await pm.plannerPage.startOver();
    await pm.plannerPage.expectWizardAtStart();
  });
});
