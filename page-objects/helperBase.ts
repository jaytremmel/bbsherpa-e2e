import { Page, BrowserContext } from '@playwright/test';

/**
 * Shared behavior for every page object and test.
 *
 * Analytics and tracker requests are blocked at the context level for two
 * reasons: they are a common source of flake, and test runs should not
 * pollute the site's real analytics.
 */
export class HelperBase {
  constructor(protected readonly page: Page) {}

  private static readonly BLOCKED_PATTERNS: RegExp[] = [
    /\/_vercel\/insights/,
    /\/_vercel\/speed-insights/,
    /vitals\.vercel-insights\.com/,
    /va\.vercel-scripts\.com/,
    /google-analytics\.com/,
    /googletagmanager\.com/,
    /doubleclick\.net/,
    /facebook\.com\/tr/,
  ];

  /** Abort analytics and tracking traffic for the whole browser context. */
  static async blockThirdPartyTraffic(context: BrowserContext): Promise<void> {
    for (const pattern of HelperBase.BLOCKED_PATTERNS) {
      await context.route(pattern, route => route.abort());
    }
  }

  /** True when a URL matches a pattern this suite deliberately blocks. */
  static isBlockedUrl(url: string): boolean {
    return HelperBase.BLOCKED_PATTERNS.some(p => p.test(url));
  }

  /**
   * Start collecting uncaught exceptions and console errors on a page.
   * Errors caused by requests this suite itself blocked are ignored.
   * Returns a live array; assert on it at the end of the test.
   */
  static collectPageErrors(page: Page): string[] {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
    page.on('console', msg => {
      if (msg.type() !== 'error') return;
      if (HelperBase.isBlockedUrl(msg.location().url)) return;
      errors.push(`console: ${msg.text()}`);
    });
    return errors;
  }
}
