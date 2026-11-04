# bbsherpa-e2e

Playwright tests for [BB Sherpa](https://www.bbsherpa.com), a real gameday guide for Buffalo Bills fans that I built and run.

[![Playwright Tests](https://github.com/jaytremmel/bbsherpa-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/jaytremmel/bbsherpa-e2e/actions/workflows/playwright.yml)

**The AI pull request:** AI wrote the checklist tests from a spec I merged first, and I reviewed them before merging. That review is the point. A passing test only helps if someone can tell what it checks.

| Feature | Spec | Test | Page object |
| --- | --- | --- | --- |
| Smoke, every route | [specs/smoke.md](specs/smoke.md) | [tests/smoke.spec.ts](tests/smoke.spec.ts) | [helperBase.ts](page-objects/helperBase.ts) |
| Forecast API | [specs/forecast-api.md](specs/forecast-api.md) | [tests/forecast-api.spec.ts](tests/forecast-api.spec.ts) | none, API only |
| Planner wizard | [specs/planner.md](specs/planner.md) | [tests/planner.spec.ts](tests/planner.spec.ts) | [plannerPage.ts](page-objects/plannerPage.ts) |
| Checklist, the AI PR | [specs/checklist.md](specs/checklist.md) | [tests/checklist.spec.ts](tests/checklist.spec.ts) | [checklistPage.ts](page-objects/checklistPage.ts) |

Spec lines carry ids (SM-1, FC-1, PL-1, CL-1) and test titles start with the id they cover, so you can trace any test back to the line that demanded it.

## Run it

```bash
npm ci
npx playwright install chromium webkit
npm test
```

`BASE_URL` defaults to production. Point it anywhere else in `.env` (see `.env.example`).

## Decisions

- **The forecast is mocked in planner tests.** Plan results depend on live weather. Mocking `/api/forecast` makes every run deterministic and lets me test the failure state, which real data almost never hits. The real API has its own tests.
- **Role and text locators only.** The app ships no test ids and I didn't want to change it to make it testable. Locators that follow the accessibility tree survive markup refactors.
- **Desktop and mobile projects.** The site is mobile-first, so every test runs twice: desktop Chrome, and an iPhone viewport on WebKit, the engine iPhones actually use.
- **Analytics traffic is blocked.** Tracker requests are aborted at the context level so test runs don't pollute the site's real numbers, and so a slow third party can't fail a test.
- **Read-only against production.** Nothing here submits data. The checklist tests touch only the browser's own localStorage.
