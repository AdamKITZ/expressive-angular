import { standard } from '../linear-progress/frame';
import { SHAPES } from './shapes';

/** CircularProgressIndicatorTokens: thickness of indicator and track, gap between them, wavelength of the wave. */
const STROKE = 4;
const GAP = 4;
const CAP = STROKE / 2;
const WAVELENGTH = 15;
const MIN_VERTICES = 5;
const MAX_VERTICES = 12;

/** Compose's indeterminate circular motion (ProgressIndicator.kt). */
const CYCLE_MS = 6000;
const GLOBAL_ROTATION = 1080;
const MIN_PROGRESS = 0.1;
const MAX_PROGRESS = 0.87;
const STEP_MS = 1500;
const STEP_TURN_MS = 300;

export interface CircularProgressFrameInput {
  size: number;
  wavy: boolean;
  /** How much of the circle the indicator covers, 0–1. */
  progress: number;
  /** Clockwise, in degrees, of the whole drawing. */
  rotation: number;
  /** 0 is a circle, 1 the full star. */
  amplitude: number;
  /** How far the wave has moved around, 0–1. */
  waveOffset: number;
  /** Whether the amplitude has changed since the indicator appeared; Compose strokes the morph only from then on. */
  morphed: boolean;
}

/** A closed path that starts at 12 o'clock and runs clockwise, of which `visible` units are drawn from `-offset`. */
export interface CircularStroke {
  d: string;
  length: number;
  visible: number;
  offset: number;
}

export interface CircularProgressFrame {
  track: CircularStroke;
  indicator: CircularStroke & { rotation: number };
  rotation: number;
}

/**
 * What Compose's `CircularProgressIndicator` (flat, drawn as arcs) or `CircularWavyProgressIndicator`
 * (CircularWavyProgressModifiers.kt, a circle morphing into a rounded star) draws. Both paths are drawn with
 * stroke-dasharray, which cuts them by arc length as Compose's `PathMeasure.getSegment` does.
 */
export function circularProgressFrame(input: CircularProgressFrameInput): CircularProgressFrame {
  const { size, progress } = input;
  const radius = (size - STROKE) / 2;
  const circle = circlePath(size / 2, radius);
  const circumference = 2 * Math.PI * radius;

  if (!input.wavy) {
    const sweep = progress * circumference;
    const gap = Math.min(sweep, (2 * radius * (GAP + STROKE)) / size);
    return {
      track: { ...circle, length: circumference, visible: circumference - sweep - 2 * gap, offset: -(sweep + gap) },
      indicator: { ...circle, length: circumference, visible: sweep, offset: 0, rotation: 0 },
      rotation: input.rotation,
    };
  }

  const star = starPath(size, vertexCount(size), input.amplitude, input.morphed);
  const stop = progress * star.length;
  const spacing = 2 * Math.min(stop, CAP) + Math.min(stop, GAP);
  const trackStart = progress * circumference + spacing;
  const shift = input.amplitude > 0 ? input.waveOffset : 0;
  return {
    track: {
      ...circle,
      length: circumference,
      visible: Math.max(0, circumference - spacing - trackStart),
      offset: -trackStart,
    },
    indicator: {
      d: star.d,
      length: 2 * star.length,
      visible: stop,
      offset: -shift * star.length,
      rotation: -shift * 360,
    },
    rotation: input.rotation,
  };
}

/** Compose fits one wave per wavelength around the circle, between 5 and the 12 recorded shapes, so a
 * wider indicator than about 60px gets longer waves.
 */
export function vertexCount(size: number): number {
  const count = Math.round((2 * Math.PI * (size / 2 - STROKE / 2)) / WAVELENGTH);
  return Math.min(Math.max(count, MIN_VERTICES), MAX_VERTICES);
}

/**
 * The indeterminate indicator `elapsedMs` after it starts: its share of the circle grows to 0.87 and shrinks back to
 * 0.1 every 6s, while it turns three times and jumps a further quarter turn every 1.5s. The rotation includes the
 * quarter turn from Compose's 3 o'clock start to the 12 o'clock start of the paths here.
 */
export function indeterminateCircle(elapsedMs: number): { progress: number; rotation: number } {
  const ms = elapsedMs % CYCLE_MS;
  // A keyframe's easing applies from that keyframe on, so the growing half is linear.
  const progress =
    ms < CYCLE_MS / 2
      ? MIN_PROGRESS + (MAX_PROGRESS - MIN_PROGRESS) * (ms / (CYCLE_MS / 2))
      : MAX_PROGRESS + (MIN_PROGRESS - MAX_PROGRESS) * standard((ms - CYCLE_MS / 2) / (CYCLE_MS / 2));
  const step = Math.min(Math.floor(ms / STEP_MS), 3);
  const stepRotation = (step + Math.min((ms - step * STEP_MS) / STEP_TURN_MS, 1)) * 90;
  return { progress, rotation: 90 + (ms / CYCLE_MS) * GLOBAL_ROTATION + stepRotation };
}

function circlePath(centre: number, radius: number): { d: string } {
  const top = `${round(centre)} ${round(centre - radius)}`;
  const bottom = `${round(centre)} ${round(centre + radius)}`;
  const arc = `A${round(radius)} ${round(radius)} 0 1 1`;
  return { d: `M${top}${arc} ${bottom}${arc} ${top}Z` };
}

/**
 * The circle-to-star morph at `amplitude`, or the star's own outline, which starts at a different point, before the
 * first morph; turned so it starts at 12 o'clock, scaled to the size less a stroke and
 * centred on its bounds, as Compose's `pathFromCubics` and `processPath` do. The outline runs round twice, so the
 * indicator still fits when the wave has moved it past the start; `length` is one round.
 */
function starPath(size: number, vertices: number, amplitude: number, morphed: boolean): { d: string; length: number } {
  const { star, start, end } = SHAPES[vertices];
  const points = !morphed && amplitude === 1 ? star : start.map((value, i) => value + (end[i] - value) * amplitude);
  const turn = (3 * Math.PI) / 2 - Math.atan2(points[1] - 0.5, points[0] - 0.5);
  const cos = Math.cos(turn);
  const sin = Math.sin(turn);
  const scale = size - STROKE;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < points.length; i += 2) {
    const x = points[i] - 0.5;
    const y = points[i + 1] - 0.5;
    xs.push((x * cos - y * sin) * scale);
    ys.push((x * sin + y * cos) * scale);
  }
  const dx = size / 2 - (Math.min(...xs) + Math.max(...xs)) / 2;
  const dy = size / 2 - (Math.min(...ys) + Math.max(...ys)) / 2;
  const at = (i: number): string => `${round(xs[i] + dx)} ${round(ys[i] + dy)}`;

  let once = '';
  let length = 0;
  for (let i = 0; i < xs.length; i += 4) {
    once += `C${at(i + 1)} ${at(i + 2)} ${at(i + 3)}`;
    length += cubicLength(xs.slice(i, i + 4), ys.slice(i, i + 4));
  }
  return { d: `M${at(0)}${once}${once}Z`, length };
}

/** By 16 chords; finer sampling changes the length of a 48px indicator by less than 0.01px. */
function cubicLength(xs: number[], ys: number[]): number {
  const at = (p: number[], t: number): number =>
    (1 - t) ** 3 * p[0] + 3 * (1 - t) ** 2 * t * p[1] + 3 * (1 - t) * t * t * p[2] + t ** 3 * p[3];
  let length = 0;
  for (let step = 1; step <= 16; step++) {
    const t0 = (step - 1) / 16;
    const t1 = step / 16;
    length += Math.hypot(at(xs, t1) - at(xs, t0), at(ys, t1) - at(ys, t0));
  }
  return length;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
