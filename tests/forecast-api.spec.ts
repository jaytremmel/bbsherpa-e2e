import { test, expect } from '@playwright/test';
import { TEST_GAME } from '../test-data';

// specs/forecast-api.md: FC-1, FC-2, FC-3.
test.describe('forecast API', () => {
  test('FC-1, FC-2: a real game returns conditions with numeric temperatures', async ({ request }) => {
    const res = await request.get(`/api/forecast/${TEST_GAME.id}`);
    expect(res.status(), 'FC-1: responds 200').toBe(200);

    const body = await res.json();
    expect(['forecast', 'historical'], 'FC-1: kind is forecast or historical').toContain(body.kind);
    expect(typeof body.high, 'FC-2: high is a number').toBe('number');
    expect(typeof body.low, 'FC-2: low is a number').toBe('number');
  });

  test('FC-3: an unknown game id returns 404 with an error body', async ({ request }) => {
    const res = await request.get('/api/forecast/wk-99-no-such-game');
    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({ error: 'Unknown game' });
  });
});
