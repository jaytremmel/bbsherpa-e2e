// Season-dependent values live here and nowhere else. When the schedule
// rolls over, update TEST_GAME and the suite follows.
export const TEST_GAME = {
  id: 'wk-11-dolphins',
  opponent: 'Miami Dolphins',
};

// Every public route with the heading that proves it rendered. Headings are
// structural (they come from page templates), but if one gets reworded,
// this table is the single place to fix.
export const ROUTES: { path: string; heading: RegExp }[] = [
  { path: '/', heading: /gameday fan guide/i },
  { path: '/planner', heading: /who are you rooting for/i },
  { path: '/map', heading: /interactive map/i },
  { path: '/checklist', heading: /gameday checklist/i },
  { path: '/tickets', heading: /tickets, without getting burned/i },
  { path: '/travel', heading: /getting here & where to stay/i },
  { path: '/cold-weather', heading: /cold weather survival guide/i },
  { path: '/faq', heading: /first-timer faq/i },
  { path: '/feed', heading: /sherpa socials/i },
  { path: '/community', heading: /join the community/i },
  { path: '/about', heading: /20 years in the lots/i },
];
