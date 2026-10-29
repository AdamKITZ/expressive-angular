import { settle } from './settle';

describe('settle', () => {
  const hidden = 600;
  const partial = 300;
  const expanded = 0;
  const anchors = [expanded, partial, hidden];

  it.each([
    ['stays expanded after a short drag', expanded, 40, 0, expanded],
    ['moves from expanded to half open after a drag of 56px', expanded, 56, 0, partial],
    ['stays half open after a short drag up', partial, 260, 0, partial],
    ['opens fully after a drag up of 56px', partial, 244, 0, expanded],
    ['hides from half open after a drag down of 56px', partial, 356, 0, hidden],
    ['hides from half open on a fling down', partial, 310, 0.2, hidden],
    ['opens fully from half open on a fling up', partial, 290, -0.2, expanded],
    ['goes to the nearest anchor past the drag on a fling', expanded, 20, 0.2, partial],
  ])('%s', (_, start, offset, velocity, target) => {
    expect(settle(anchors, start, offset, velocity)).toBe(target);
  });

  it('hides a sheet without a half-open anchor after a drag of 56px', () => {
    expect(settle([0, 200], 0, 60, 0)).toBe(200);
  });
});
