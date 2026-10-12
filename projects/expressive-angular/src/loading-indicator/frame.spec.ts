import { loadingIndicatorFrame } from './frame';

describe('loadingIndicatorFrame', () => {
  it.each([
    { name: 'starts a quarter turned', elapsedMs: 0, reducedMotion: false, rotation: 90 },
    {
      name: 'adds a quarter turn per morph on top of the steady turn',
      elapsedMs: 650,
      reducedMotion: false,
      rotation: 180 + (650 / 4666) * 360,
    },
    {
      name: 'only keeps the steady turn with reduced motion',
      elapsedMs: 650,
      reducedMotion: true,
      rotation: 90 + (650 / 4666) * 360,
    },
  ])('$name', ({ elapsedMs, reducedMotion, rotation }) => {
    expect(loadingIndicatorFrame(elapsedMs, reducedMotion).rotation).toBeCloseTo(rotation);
  });

  it('keeps a single shape with reduced motion', () => {
    expect(loadingIndicatorFrame(1000, true).path).toBe(loadingIndicatorFrame(0, true).path);
  });

  it('keeps every shape of a full sequence inside the box', () => {
    for (let elapsedMs = 0; elapsedMs < 7 * 650; elapsedMs += 10) {
      const coordinates = loadingIndicatorFrame(elapsedMs, false)
        .path.match(/-?[\d.]+/g)!
        .map(Number);
      expect(Math.min(...coordinates)).toBeGreaterThanOrEqual(0);
      expect(Math.max(...coordinates)).toBeLessThanOrEqual(1);
    }
  });
});
