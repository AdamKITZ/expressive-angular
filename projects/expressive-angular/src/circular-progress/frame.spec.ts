import { circularProgressFrame, indeterminateCircle, vertexCount } from './frame';

const base = { rotation: 0, amplitude: 0, waveOffset: 0, morphed: false };

describe('circularProgressFrame', () => {
  it('starts a flat indicator at 12 o’clock and leaves a gap of the gap plus a stroke to the track', () => {
    const { indicator, track } = circularProgressFrame({ ...base, size: 40, wavy: false, progress: 0.25 });
    const circumference = 2 * Math.PI * 18;
    const gap = (2 * 18 * 8) / 40;
    expect(indicator.offset).toBe(0);
    expect(indicator.visible).toBeCloseTo(circumference / 4);
    expect(-track.offset).toBeCloseTo(circumference / 4 + gap);
    expect(track.visible).toBeCloseTo(circumference * 0.75 - 2 * gap);
  });

  it('keeps 8px between a wavy indicator and its track on both sides', () => {
    const { track } = circularProgressFrame({ ...base, size: 48, wavy: true, progress: 0.5 });
    expect(-track.offset).toBeCloseTo(track.length / 2 + 8);
    expect(track.length - (-track.offset + track.visible)).toBeCloseTo(8);
  });

  it('moves the wave along the indicator and turns it back, so the ends stay put', () => {
    const still = circularProgressFrame({ ...base, size: 48, wavy: true, progress: 0.5, amplitude: 1 });
    const moved = circularProgressFrame({
      ...base,
      size: 48,
      wavy: true,
      progress: 0.5,
      amplitude: 1,
      waveOffset: 0.25,
    });
    expect(moved.indicator.offset).toBeCloseTo(still.indicator.offset - (0.25 * still.indicator.length) / 2);
    expect(moved.indicator.rotation).toBeCloseTo(-90);
  });

  it('keeps the whole indicator when the wave has moved past the end of the outline', () => {
    const { indicator } = circularProgressFrame({
      ...base,
      size: 48,
      wavy: true,
      progress: 0.87,
      amplitude: 1,
      waveOffset: 0.9,
    });
    expect(-indicator.offset + indicator.visible).toBeLessThanOrEqual(indicator.length);
  });
});

describe('vertexCount', () => {
  it.each([
    { size: 48, count: 9 },
    { size: 24, count: 5 },
    { size: 400, count: 12 },
  ])('gives a $size px indicator $count waves', ({ size, count }) => {
    expect(vertexCount(size)).toBe(count);
  });
});

describe('indeterminateCircle', () => {
  // Rotations include the quarter turn that moves Compose's 3 o'clock start onto the 12 o'clock drawing.
  it.each([
    { elapsedMs: 0, progress: 0.1, rotation: 90 },
    { elapsedMs: 300, progress: 0.1 + 0.77 * 0.1, rotation: 90 + 54 + 90 },
    { elapsedMs: 3000, progress: 0.87, rotation: 90 + 540 + 180 },
  ])('at $elapsedMs ms', ({ elapsedMs, progress, rotation }) => {
    const circle = indeterminateCircle(elapsedMs);
    expect(circle.progress).toBeCloseTo(progress);
    expect(circle.rotation).toBeCloseTo(rotation);
  });
});
