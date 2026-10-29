// Compose's AnchoredDraggableDefaults for sheets: BottomSheetDefaults.PositionalThreshold (56dp) and
// VelocityThreshold (125dp per second, here in px per ms).
const positionalThreshold = 56;
const velocityThreshold = 0.125;

/**
 * The anchor a dragged sheet settles at, as Compose's anchored draggable picks it: a fling goes to the next anchor in
 * its direction; otherwise the sheet leaves its start anchor only once it has moved 56px, and then for the next anchor
 * that way. Offsets grow downwards, so the largest anchor is hidden.
 */
export function settle(anchors: readonly number[], start: number, offset: number, velocity: number): number {
  const sorted = [...anchors].sort((a, b) => a - b);
  const above = (limit: number): number | undefined => [...sorted].reverse().find((anchor) => anchor < limit);
  const below = (limit: number): number | undefined => sorted.find((anchor) => anchor > limit);
  if (Math.abs(velocity) >= velocityThreshold) {
    const ahead = velocity > 0 ? below(offset) : above(offset);
    return ahead ?? nearest(sorted, offset);
  }
  const moved = offset - start;
  if (Math.abs(moved) < positionalThreshold) {
    return start;
  }
  const next = moved > 0 ? below(start) : above(start);
  const target = nearest(sorted, offset);
  return target === start ? (next ?? start) : target;
}

function nearest(anchors: readonly number[], offset: number): number {
  return anchors.reduce((best, anchor) => (Math.abs(anchor - offset) < Math.abs(best - offset) ? anchor : best));
}
