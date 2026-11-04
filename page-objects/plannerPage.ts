import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import { TEST_GAME } from '../test-data';

// A fixed conditions payload keeps planner results independent of real
// weather, so the same answers always produce the same plan.
const MOCK_CONDITIONS = {
  kind: 'historical',
  high: 38,
  low: 27,
  precipChance: 0.4,
  snowLikely: true,
  summary: 'Typically cold, around 38/27, snow possible.',
};

export class PlannerPage extends HelperBase {
  async goto(): Promise<void> {
    await this.page.goto('/planner');
  }

  /** Answer the forecast call with fixed conditions. */
  async mockForecast(): Promise<void> {
    await this.page.route('**/api/forecast/**', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_CONDITIONS),
      })
    );
  }

  /** Make the forecast call fail, which real data rarely does. */
  async mockForecastFailure(): Promise<void> {
    await this.page.route('**/api/forecast/**', route =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'boom' }),
      })
    );
  }

  /**
   * Walk all six wizard steps. Steps auto-advance after a selection;
   * the final step needs the explicit submit button.
   */
  async completeWizard(): Promise<void> {
    await this.selectOption(/bills fan/i);
    await this.selectOption(/season regular/i);
    await this.selectOption(new RegExp(`vs ${TEST_GAME.opponent}`, 'i'));
    await this.selectOption(/rideshare/i);
    await this.selectOption(/no tailgate/i);
    await this.selectOption(/solo \/ couple/i);
    await this.page.getByRole('button', { name: /get my plan/i }).click();
  }

  async expectResults(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /your gameday plan/i })).toBeVisible();
    await expect(this.page.getByRole('button', { name: /start over/i })).toBeVisible();
  }

  async startOver(): Promise<void> {
    await this.page.getByRole('button', { name: /start over/i }).click();
  }

  async expectWizardAtStart(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /who are you rooting for/i })).toBeVisible();
  }

  async expectForecastError(): Promise<void> {
    await expect(this.page.getByText("Couldn't load conditions. Try again in a moment.")).toBeVisible();
    await expect(this.page.getByRole('button', { name: /try again/i })).toBeVisible();
  }

  async tryAgain(): Promise<void> {
    await this.page.getByRole('button', { name: /try again/i }).click();
  }

  private async selectOption(name: RegExp): Promise<void> {
    await this.page.getByRole('button', { name }).click();
  }
}
