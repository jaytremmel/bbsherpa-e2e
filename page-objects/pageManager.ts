import { Page, BrowserContext } from '@playwright/test';
import { HelperBase } from './helperBase';
import { PlannerPage } from './plannerPage';
import { ChecklistPage } from './checklistPage';

/**
 * Single entry point for page objects. Pages are built lazily, and tests
 * depend on this one object, which keeps imports stable as the suite grows.
 */
export class PageManager {
  private _plannerPage?: PlannerPage;
  private _checklistPage?: ChecklistPage;

  constructor(private readonly page: Page, private readonly context: BrowserContext) {}

  async setup(): Promise<void> {
    await HelperBase.blockThirdPartyTraffic(this.context);
  }

  get plannerPage(): PlannerPage {
    return (this._plannerPage ??= new PlannerPage(this.page));
  }

  get checklistPage(): ChecklistPage {
    return (this._checklistPage ??= new ChecklistPage(this.page));
  }
}
