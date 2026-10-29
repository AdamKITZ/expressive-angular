import { settleSide } from './settle-side';

describe('settleSide', () => {
  const width = 256;

  it.each([
    ['stays open when released before half way', 100, 0, false],
    ['hides when released past half way', 140, 0, true],
    ['hides on a fast swipe out, even near the open edge', 40, 0.6, true],
    ['stays open on a slow swipe out before half way', 40, 0.3, false],
    ['stays open on any swipe back in, even past half way', 200, -0.1, false],
  ])('%s', (_, offset, velocity, hidden) => {
    expect(settleSide(offset, width, velocity)).toBe(hidden);
  });
});
