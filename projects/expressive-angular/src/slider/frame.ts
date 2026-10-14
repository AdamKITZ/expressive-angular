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
  active: boolean;
}

export interface SliderFrameInput {
  /** Width of the track, which is the slider's width less half of each thumb. */
  width: number;
  /** Where the start and the end of the active range sit between the minimum and the maximum, 0–1. */
  start: number;
  end: number;
  /** Positions of the steps, 0–1, first and last included; empty for a continuous slider. */
  ticks: number[];
  /** A slider has an end thumb only; a range slider has both. */
  range: boolean;
  startThumbWidth: number;
  endThumbWidth: number;
}

export interface SliderFrame {
  /** Centres of the thumbs, measured along the track. */
  startThumb: number;
  endThumb: number;
  pieces: TrackPiece[];
  /** Centres of the stop indicators at the outer ends of the inactive tracks. */
  stops: number[];
  ticks: { cx: number; active: boolean }[];
}

/**
 * What Compose's `Slider` and `RangeSlider` draw (`SliderDefaults.drawTrack`): an active track between the thumbs
 * and an inactive track outside them, each kept a gap away from the thumbs, with a dot at the outer ends and one per
 * step. Between the first and the last step a thumb is inset by a corner, so a step's thumb lines up with its dot.
 */
export function sliderFrame(input: SliderFrameInput): SliderFrame {
  const { width, ticks, range } = input;
  const position = (fraction: number): number =>
    ticks.length > 0 && fraction !== ticks[0] && fraction !== ticks[ticks.length - 1]
      ? (width - 2 * CORNER) * fraction + CORNER
      : width * fraction;
  const startThumb = range ? position(input.start) : 0;
  const endThumb = position(input.end);
  const startGap = input.startThumbWidth / 2 + THUMB_GAP;
  const endGap = input.endThumbWidth / 2 + THUMB_GAP;

  const pieces: TrackPiece[] = [];
  const stops: number[] = [];
  if (range && startThumb > startGap + CORNER) {
    pieces.push({ x: 0, width: startThumb - startGap, startRadius: CORNER, endRadius: INSIDE_CORNER, active: false });
    stops.push(CORNER);
  }
  if (endThumb < width - endGap - CORNER) {
    const x = endThumb + endGap;
    pieces.push({ x, width: width - x, startRadius: INSIDE_CORNER, endRadius: CORNER, active: false });
    stops.push(width - CORNER);
  }
  const activeStart = range ? startThumb + startGap : 0;
  const activeEnd = endThumb - endGap;
  const startRadius = range ? INSIDE_CORNER : CORNER;
  if (activeEnd - activeStart > startRadius) {
    pieces.push({
      x: activeStart,
      width: activeEnd - activeStart,
      startRadius,
      endRadius: INSIDE_CORNER,
      active: true,
    });
  }

  const dots = ticks
    .slice(range ? 1 : 0, -1)
    .map((tick) => CORNER + (width - 2 * CORNER) * tick)
    .filter((cx) => Math.abs(cx - endThumb) > endGap && !(range && Math.abs(cx - startThumb) <= startGap))
    .map((cx) => ({ cx, active: cx >= activeStart && cx <= activeEnd }));
  return { startThumb, endThumb, pieces, stops, ticks: dots };
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
