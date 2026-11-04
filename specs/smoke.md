# Smoke

Every public route loads and renders. Headings come from the route table in
`test-data.ts`, one line per route, so a copy change is a one-line fix.

- SM-1: WHEN a user requests any public route, THE SYSTEM SHALL respond with HTTP 200.
- SM-2: WHEN any public route renders, THE SYSTEM SHALL display that route's main heading.
- SM-3: WHEN any public route renders, THE SYSTEM SHALL log no uncaught exceptions and no console errors (errors from traffic the suite itself blocks are excluded).

Routes covered: `/`, `/planner`, `/map`, `/checklist`, `/tickets`, `/travel`,
`/cold-weather`, `/faq`, `/feed`, `/community`, `/about`.
