# Planner

The wizard at `/planner` asks six questions and calls
`GET /api/forecast/{gameId}` on submit. Tests mock that call so results do
not depend on the weather, and so the failure state can be exercised.

- PL-1: WHEN a user answers all six steps and submits, THE SYSTEM SHALL display the gameday plan results.
- PL-2: WHEN the forecast request fails, THE SYSTEM SHALL display "Couldn't load conditions. Try again in a moment." and a Try Again button.
- PL-3: WHEN a user activates Try Again after a failure, THE SYSTEM SHALL return to the wizard.
- PL-4: WHEN a user activates Start Over on the results, THE SYSTEM SHALL return to the first wizard step.
