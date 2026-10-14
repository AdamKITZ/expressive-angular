/** SliderTokens: track height, the corner on the thumb's side of the track, gap between thumb and track, dot size. */
const TRACK_HEIGHT = 16;
const CORNER = TRACK_HEIGHT / 2;
const INSIDE_CORNER = 2;
const THUMB_GAP = 6;
export const DOT_SIZE = 4;

/** A piece of the track from `x`, rounded by `startRadius` on its left and `endRadius` on its right. */
export interface TrackPiece {
  x: number;
  width: number;
  startRadius: number;
  endRadius: number;
}

export interface SliderFrameInput {
  /** Width of the track, which is the slider's width less one thumb. */
  width: number;
  /** Where the value sits between the minimum and the maximum, 0–1. */
  fraction: number;
  /** Positions of the steps, 0–1, first and last included; empty for a continuous slider. */
  ticks: number[];
  thumbWidth: number;
}

export interface SliderFrame {
  /** Centre of the thumb, measured along the track. */
  thumb: number;
  active: TrackPiece | null;
  inactive: TrackPiece | null;
  /** The stop indicator at the end of the inactive track. */
  stop: number | null;
  ticks: { cx: number; active: boolean }[];
}

/**
 * What Compose's `Slider` draws (`SliderDefaults.drawTrack`): an active track up to the thumb and an inactive track
 * after it, each kept a gap away from the thumb, with a dot at the end and one per step. Between the first and the
 * last step the thumb is inset by a corner, so a step's thumb lines up with its dot.
 */
export function sliderFrame({ width, fraction, ticks, thumbWidth }: SliderFrameInput): SliderFrame {
  const onEndStep = fraction === ticks[0] || fraction === ticks[ticks.length - 1];
  const thumb = ticks.length > 0 && !onEndStep ? (width - 2 * CORNER) * fraction + CORNER : width * fraction;
  const gap = thumbWidth / 2 + THUMB_GAP;

  const activeEnd = thumb - gap;
  const active = activeEnd > CORNER ? { x: 0, width: activeEnd, startRadius: CORNER, endRadius: INSIDE_CORNER } : null;
  const inactive =
    thumb < width - gap - CORNER
      ? { x: thumb + gap, width: width - thumb - gap, startRadius: INSIDE_CORNER, endRadius: CORNER }
      : null;

  const dots = ticks
    .slice(0, -1)
    .map((tick) => CORNER + (width - 2 * CORNER) * tick)
    .filter((cx) => Math.abs(cx - thumb) > gap)
    .map((cx) => ({ cx, active: cx <= activeEnd }));
  return { thumb, active, inactive, stop: inactive ? width - CORNER : null, ticks: dots };
}

/** An SVG path for a track piece of the track's height. */
export function trackPath({ x, width, startRadius, endRadius }: TrackPiece): string {
  const h = TRACK_HEIGHT;
  const s = startRadius;
  const e = endRadius;
  const right = x + width;
  return (
    `M${x + s} 0H${right - e}A${e} ${e} 0 0 1 ${right} ${e}V${h - e}A${e} ${e} 0 0 1 ${right - e} ${h}` +
    `H${x + s}A${s} ${s} 0 0 1 ${x} ${h - s}V${s}A${s} ${s} 0 0 1 ${x + s} 0Z`
  );
}
