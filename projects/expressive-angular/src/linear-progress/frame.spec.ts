import { indeterminateFractions, linearProgressFrame, waveAmplitude } from './frame';

const numbers = (path: string): number[] => path.match(/-?[\d.]+/g)!.map(Number);
const xs = (path: string): number[] => numbers(path).filter((_, i) => i % 2 === 0);
const ys = (path: string): number[] => numbers(path).filter((_, i) => i % 2 === 1);

const flat = { width: 200, height: 4, wavelength: 40, amplitude: 0, waveOffset: 0 };

describe('linearProgressFrame', () => {
  it('leaves a 4px gap between the indicator and the track', () => {
    const frame = linearProgressFrame({ ...flat, fractions: [0, 0.5], stop: true });
    const indicatorEnd = Math.max(...xs(frame.indicators[0])) + 2;
    const trackStart = Math.min(...xs(frame.track)) - 2;
    expect(trackStart - indicatorEnd).toBeCloseTo(4);
  });

  it.each([
    { progress: 0.5, radius: 2 },
    { progress: 0.98, radius: 1 },
    { progress: 1, radius: 0 },
  ])('shrinks the stop indicator once the indicator reaches it ($progress)', ({ progress, radius }) => {
    const frame = linearProgressFrame({ ...flat, fractions: [0, progress], stop: true });
    expect(frame.stop?.r ?? 0).toBeCloseTo(radius);
  });

  it('keeps a wave inside the height at full amplitude, 3px around the middle', () => {
    const frame = linearProgressFrame({ ...flat, height: 10, amplitude: 1, fractions: [0, 1], stop: false });
    const path = frame.indicators[0];
    // Control points of a quadratic wave sit twice as far from the middle as its peaks.
    expect(Math.max(...ys(path))).toBeCloseTo(5 + 6);
    expect(Math.min(...ys(path))).toBeCloseTo(5 - 6);
  });

  it('moves the wave, not the indicator, with the wave offset', () => {
    const frame = (waveOffset: number): string =>
      linearProgressFrame({ ...flat, height: 10, amplitude: 1, waveOffset, fractions: [0, 0.5], stop: false })
        .indicators[0];
    expect(xs(frame(0.25))[0]).toBeCloseTo(xs(frame(0))[0]);
    expect(frame(0.25)).not.toBe(frame(0));
  });
});

describe('waveAmplitude', () => {
  it.each([
    { progress: 0.1, amplitude: 0 },
    { progress: 0.5, amplitude: 1 },
    { progress: 0.95, amplitude: 0 },
  ])('is $amplitude at $progress', ({ progress, amplitude }) => {
    expect(waveAmplitude(progress)).toBe(amplitude);
  });
});

describe('indeterminateFractions', () => {
  it('starts with both lines at the start of the track', () => {
    expect(indeterminateFractions(0)).toEqual([0, 0, 0, 0]);
  });

  it('has the first line gone and the second one running after 1250ms', () => {
    const [firstTail, firstHead, secondTail, secondHead] = indeterminateFractions(1250);
    expect([firstTail, firstHead]).toEqual([1, 1]);
    expect(0 < secondTail && secondTail < secondHead && secondHead < 1).toBe(true);
  });

  it('repeats every 1750ms', () => {
    expect(indeterminateFractions(1250 + 1750)).toEqual(indeterminateFractions(1250));
  });
});
