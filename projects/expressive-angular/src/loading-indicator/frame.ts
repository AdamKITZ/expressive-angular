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

/** Scales the cubics and centres their bounds in the box, as Compose's `processPath` does. */
function toPath(points: number[]): string {
  const xs = points.filter((_, i) => i % 2 === 0);
  const ys = points.filter((_, i) => i % 2 === 1);
  const offsetX = 0.5 - ((Math.min(...xs) + Math.max(...xs)) / 2) * SHAPE_SCALE;
  const offsetY = 0.5 - ((Math.min(...ys) + Math.max(...ys)) / 2) * SHAPE_SCALE;
  const at = (i: number): string =>
    `${round(points[i] * SHAPE_SCALE + offsetX)} ${round(points[i + 1] * SHAPE_SCALE + offsetY)}`;
  const curves: string[] = [];
  for (let i = 0; i < points.length; i += 8) {
    curves.push(`C${at(i + 2)} ${at(i + 4)} ${at(i + 6)}`);
  }
  return `M${at(0)}${curves.join('')}Z`;
}

function round(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}
