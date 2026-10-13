import { MORPH_PROGRESS, MORPHS, SHAPE_SCALE } from './morphs';

/** `MorphIntervalMillis` and `GlobalRotationDurationMillis` in Compose's LoadingIndicator.kt. */
const MORPH_INTERVAL_MS = 650;
const GLOBAL_ROTATION_MS = 4666;
const FRAME_MS = 1000 / 60;

export interface LoadingIndicatorFrame {
  /** SVG path in a 1×1 box. */
  path: string;
  /** Clockwise, in degrees, around the box centre. */
  rotation: number;
}

/**
 * What Compose's indeterminate `LoadingIndicator` draws `elapsedMs` after it starts: a new morph every 650ms driven by
 * a bouncy spring, each adding a quarter turn, on top of a steady full turn every 4.666s. Reduced motion keeps the
 * first shape and only the steady turn.
 */
export function loadingIndicatorFrame(elapsedMs: number, reducedMotion: boolean): LoadingIndicatorFrame {
  const cycle = reducedMotion ? 0 : Math.floor(elapsedMs / MORPH_INTERVAL_MS);
  const progress = reducedMotion ? 0 : morphProgress(elapsedMs - cycle * MORPH_INTERVAL_MS);
  const morph = MORPHS[cycle % MORPHS.length];
  const points = morph.start.map((start, i) => start + (morph.end[i] - start) * progress);
  const morphRotation = progress * 90 + ((cycle + 1) % 4) * 90;
  const globalRotation = ((elapsedMs % GLOBAL_ROTATION_MS) / GLOBAL_ROTATION_MS) * 360;
  return { path: toPath(points), rotation: (morphRotation + globalRotation) % 360 };
}

function morphProgress(ms: number): number {
  const frame = ms / FRAME_MS;
  const before = Math.floor(frame);
  if (before >= MORPH_PROGRESS.length - 1) return 1;
  return MORPH_PROGRESS[before] + (MORPH_PROGRESS[before + 1] - MORPH_PROGRESS[before]) * (frame - before);
}

/**
 * Scales the cubics and puts their centre of area in the middle of the box. Compose's `processPath` centres the
 * bounds instead, which leaves the pentagon's centre of area 1.2px off the rotation centre at 48px, so it wobbles.
 */
function toPath(points: number[]): string {
  const [centreX, centreY] = areaCentre(points);
  const offsetX = 0.5 - centreX * SHAPE_SCALE;
  const offsetY = 0.5 - centreY * SHAPE_SCALE;
  const at = (i: number): string =>
    `${round(points[i] * SHAPE_SCALE + offsetX)} ${round(points[i + 1] * SHAPE_SCALE + offsetY)}`;
  const curves: string[] = [];
  for (let i = 0; i < points.length; i += 8) {
    curves.push(`C${at(i + 2)} ${at(i + 4)} ${at(i + 6)}`);
  }
  return `M${at(0)}${curves.join('')}Z`;
}

/** From a polygon of 16 points per cubic; finer sampling moves the result by less than 0.01px at 48px. */
function areaCentre(points: number[]): [number, number] {
  const polygon: [number, number][] = [];
  for (let i = 0; i < points.length; i += 8) {
    for (let step = 0; step < 16; step++) {
      const t = step / 16;
      const u = 1 - t;
      const at = (k: number): number =>
        u * u * u * points[i + k] +
        3 * u * u * t * points[i + 2 + k] +
        3 * u * t * t * points[i + 4 + k] +
        t * t * t * points[i + 6 + k];
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

function round(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}
