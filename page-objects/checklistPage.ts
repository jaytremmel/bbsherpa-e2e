import { expect, Locator } from '@playwright/test';
import { HelperBase } from './helperBase';

/**
 * The /checklist page. Items are checkboxes whose <input> is visually hidden
 * (class "sr-only"), so toggles go through { force: true } rather than a real
 * click on a 1px target. Checked state persists in localStorage; filters do
 * not, and are driven either by the top-of-list toggle buttons or by the
 * ?tailgate=true / ?cold=true / ?kids=true query params.
 */
export class ChecklistPage extends HelperBase {
  /** Open the checklist, optionally with a filter query like '?cold=true'. */
  async goto(query = ''): Promise<void> {
    await this.page.goto('/checklist' + query);
    await expect(this.page.getByRole('heading', { name: /gameday checklist/i })).toBeVisible();
  }

  /** A single checklist item, located by (part of) its label text. */
  item(name: RegExp): Locator {
    return this.page.getByRole('checkbox', { name });
  }

  async checkItem(name: RegExp): Promise<void> {
    await this.item(name).check({ force: true });
  }

  async uncheckItem(name: RegExp): Promise<void> {
    await this.item(name).uncheck({ force: true });
  }

  /** Visible only once at least one item is checked. */
  get resetButton(): Locator {
    return this.page.getByRole('button', { name: /reset/i });
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }

  /** A situation filter toggle (Tailgating, Cold Game, Kids). */
  filterButton(name: RegExp): Locator {
    return this.page.getByRole('button', { name });
  }

  async toggleFilter(name: RegExp): Promise<void> {
    await this.filterButton(name).click();
  }

  private get progressLine(): Locator {
    return this.page.getByText(/\d+ of \d+ items packed/i);
  }

  /** Parse the "{checked} of {total} items packed" line into numbers. */
  async readProgress(): Promise<{ checked: number; total: number }> {
    const text = (await this.progressLine.textContent()) ?? '';
    const m = text.match(/(\d+)\s+of\s+(\d+)\s+items packed/i);
    if (!m) throw new Error(`progress line not found in: ${JSON.stringify(text)}`);
    return { checked: Number(m[1]), total: Number(m[2]) };
  }

  /** Wait for the progress line to show a specific count. */
  async expectProgress(checked: number, total: number): Promise<void> {
    await expect(this.progressLine).toHaveText(
      new RegExp(`${checked} of ${total} items packed`, 'i')
    );
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await expect(this.page.getByRole('heading', { name: /gameday checklist/i })).toBeVisible();
  }
}
