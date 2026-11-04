# Forecast API

`GET /api/forecast/{gameId}` backs the planner. Game ids look like
`wk-2-lions` and change each season; the current one lives in
`test-data.ts` as `TEST_GAME`.

- FC-1: WHEN a client requests the forecast for a real game id, THE SYSTEM SHALL respond 200 with `kind` equal to `forecast` or `historical`.
- FC-2: WHEN a client requests the forecast for a real game id, THE SYSTEM SHALL include numeric `high` and `low` temperatures.
- FC-3: WHEN a client requests the forecast for an unknown game id, THE SYSTEM SHALL respond 404 with body `{ "error": "Unknown game" }`.
