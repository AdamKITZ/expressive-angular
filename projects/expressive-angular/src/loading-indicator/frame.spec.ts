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

  it('turns every shape around its centre of area', () => {
    for (let elapsedMs = 0; elapsedMs < 7 * 650; elapsedMs += 10) {
      const [x, y] = areaCentre(loadingIndicatorFrame(elapsedMs, false).path);
      expect(Math.hypot(x - 0.5, y - 0.5)).toBeLessThan(0.002);
    }
  });
});

/** Centre of area of a closed path of cubics (`M x y C x y x y x y …`), from a dense polygon along it. */
function areaCentre(path: string): [number, number] {
  const n = path.match(/-?[\d.]+/g)!.map(Number);
  const polygon: [number, number][] = [];
  for (let i = 0; i + 7 < n.length; i += 6) {
    for (let step = 0; step < 32; step++) {
      const t = step / 32;
      const u = 1 - t;
      const at = (k: number): number =>
        u * u * u * n[i + k] + 3 * u * u * t * n[i + 2 + k] + 3 * u * t * t * n[i + 4 + k] + t * t * t * n[i + 6 + k];
      polygon.push([at(0), at(1)]);
    }
  }
  let area = 0;
  let x = 0;
  let y = 0;
  polygon.forEach(([x0, y0], i) => {
    const [x1, y1] = polygon[(i + 1) % polygon.length];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    x += (x0 + x1) * cross;
    y += (y0 + y1) * cross;
  });
  return [x / (3 * area), y / (3 * area)];
}
