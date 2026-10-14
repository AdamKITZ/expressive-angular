/** LinearProgressIndicatorTokens: thickness of indicator and track, gap between them, stop indicator size. */
const STROKE = 4;
const GAP = 4;
const STOP_SIZE = 4;
const CAP = STROKE / 2;

/** Compose's indeterminate keyframes (ProgressIndicator.kt): cycle length, then delay and duration of each edge. */
const CYCLE_MS = 1750;
const EDGES = [
  { delay: 250, duration: 1000 },
  { delay: 0, duration: 1000 },
  { delay: 900, duration: 850 },
  { delay: 650, duration: 850 },
];

export interface LinearProgressFrameInput {
  width: number;
  height: number;
  /** Pairs of tail and head, each 0–1 along the track. */
  fractions: number[];
  /** 0 draws straight lines, 1 a wave as tall as the height allows. */
  amplitude: number;
  wavelength: number;
  /** How far the wave has moved, in wavelengths (0–1). */
  waveOffset: number;
  stop: boolean;
}

export interface LinearProgressFrame {
  track: string;
  indicators: string[];
  stop: { cx: number; r: number } | null;
}

/**
 * What Compose's `LinearWavyProgressIndicator` draws (LinearWavyProgressModifiers.kt), as SVG paths stroked with
 * round caps. With zero amplitude in a 4px box it is the flat `LinearProgressIndicator`. The wave segment is cut by
 * x position; Compose cuts it by arc length scaled to the width, which differs by less than a pixel at the tips.
 */
export function linearProgressFrame(input: LinearProgressFrameInput): LinearProgressFrame {
  const { width, height, fractions } = input;
  const middle = height / 2;
  const indicators: string[] = [];
  let track = '';
  let trackEnd = width - CAP;
  track += `M${round(trackEnd)} ${middle}`;
  let gap = GAP;
  let indicatorVisible = false;

  for (let i = 0; i < fractions.length; i += 2) {
    const tail = fractions[i] * width;
    const head = fractions[i + 1] * width;
    if (i === 0) {
      gap = head < CAP ? 0 : Math.min(head - CAP, GAP);
      indicatorVisible = head >= CAP;
    }
    const adjustedHead = clamp(head, CAP, width - CAP);
    const adjustedTail = clamp(tail, CAP, width - CAP);
    indicators.push(fractions[i + 1] - fractions[i] > 0 ? wave(adjustedTail, adjustedHead, input) : '');

    const spacing = indicatorVisible ? gap + CAP * 2 : gap;
    if (trackEnd > adjustedHead + spacing) {
      track += `L${round(Math.max(CAP, adjustedHead + spacing))} ${middle}`;
    }
    if (head > tail) {
      trackEnd = Math.max(CAP, adjustedTail - spacing);
      track += `M${round(trackEnd)} ${middle}`;
    }
  }
  if (trackEnd > CAP) {
    track += `L${CAP} ${middle}`;
  }

  // Drops moves that no line follows.
  track = track.replace(/M[^ML]+(?=M|$)/g, '');
  return { track, indicators, stop: input.stop ? stopIndicator(width, fractions[1]) : null };
}

/** Compose's `WavyProgressIndicatorDefaults.indicatorAmplitude`: flat near the start and the end. */
export function waveAmplitude(progress: number): number {
  return progress <= 0.1 || progress >= 0.95 ? 0 : 1;
}

/** `IncreasingAmplitudeAnimationSpec` and `DecreasingAmplitudeAnimationSpec` in WavyProgressIndicator.kt. */
const AMPLITUDE_MS = 500;

/** A change of the wave's amplitude that started `since` ms after the indicator did. */
export interface AmplitudeTransition {
  from: number;
  to: number;
  since: number;
}

/** Compose eases the wave in with the standard curve and out with the emphasized accelerate one. */
export function amplitudeAt({ from, to, since }: AmplitudeTransition, elapsedMs: number): number {
  const t = Math.min((elapsedMs - since) / AMPLITUDE_MS, 1);
  return from + (to - from) * (to > from ? standard(t) : emphasizedAccelerate(t));
}

/** Tail and head of the two lines of the indeterminate indicator, `elapsedMs` after it starts. */
export function indeterminateFractions(elapsedMs: number): number[] {
  const ms = elapsedMs % CYCLE_MS;
  return EDGES.map(({ delay, duration }) => emphasizedAccelerate(clamp((ms - delay) / duration, 0, 1)));
}

/** Shrinks once the indicator's head reaches it, so the two never overlap. */
function stopIndicator(width: number, progress: number): { cx: number; r: number } | null {
  let size = STOP_SIZE;
  let x = width - size;
  const head = width * progress + CAP;
  if (x <= head) {
    size = Math.max(0, size - (head - x));
    x = head;
  }
  return size > 0 ? { cx: round(x + size / 2), r: round(size / 2) } : null;
}

/**
 * The part of the wave between `from` and `to`. The wave is a chain of quadratic curves, one per half wavelength, with
 * the control point in the middle, so x is linear in the curve parameter and a cut at x is a cut at a parameter.
 */
function wave(from: number, to: number, input: LinearProgressFrameInput): string {
  const { height, amplitude, wavelength } = input;
  const middle = height / 2;
  if (amplitude === 0) return `M${round(from)} ${middle}L${round(to)} ${middle}`;

  const shift = input.waveOffset * wavelength;
  const half = wavelength / 2;
  // Control points this far from the middle put the peaks at (height - stroke) / 2, so the stroke stays inside.
  const control = (height - STROKE) * amplitude;
  const y = (piece: number, t: number): number => middle + 2 * t * (1 - t) * control * (piece % 2 === 0 ? 1 : -1);
  const slope = (piece: number, t: number): number => 2 * (1 - 2 * t) * control * (piece % 2 === 0 ? 1 : -1);

  const start = from + shift;
  const end = to + shift;
  let path = `M${round(from)} ${round(y(Math.floor(start / half), (start % half) / half))}`;
  for (let piece = Math.floor(start / half); piece * half < end; piece++) {
    const t0 = Math.max(0, (start - piece * half) / half);
    const t1 = Math.min(1, (end - piece * half) / half);
    const controlX = piece * half + ((t0 + t1) / 2) * half - shift;
    const controlY = y(piece, t0) + ((t1 - t0) / 2) * slope(piece, t0);
    path += `Q${round(controlX)} ${round(controlY)} ${round(piece * half + t1 * half - shift)} ${round(y(piece, t1))}`;
  }
  return path;
}

/** `MotionTokens.EasingEmphasizedAccelerateCubicBezier`, cubic-bezier(0.3, 0, 0.8, 0.15). */
function emphasizedAccelerate(x: number): number {
  return cubicBezier(0.3, 0, 0.8, 0.15, x);
}

/** `MotionTokens.EasingStandardCubicBezier`, cubic-bezier(0.2, 0, 0, 1). */
export function standard(x: number): number {
  return cubicBezier(0.2, 0, 0, 1, x);
}

/** CSS cubic-bezier timing: finds the curve parameter for `x` by bisection, then returns its y. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number, x: number): number {
  if (x <= 0 || x >= 1) return Math.round(x);
  const at = (p1: number, p2: number, t: number): number =>
    3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t;
  let low = 0;
  let high = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2;
    if (at(x1, x2, mid) < x) low = mid;
    else high = mid;
  }
  return at(y1, y2, (low + high) / 2);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
