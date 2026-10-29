// SideSheetBehavior's SIGNIFICANT_VEL_THRESHOLD, 500px per second, here in px per ms.
const significantVelocity = 0.5;

/**
 * Whether a modal side sheet released after a drag hides, as Material Components' SideSheetBehavior decides: a swipe
 * back in keeps it open; otherwise it hides on a fast swipe out or when released past half its width. The offset is
 * how far the sheet has moved out, and a positive velocity points out.
 */
export function settleSide(offset: number, width: number, velocity: number): boolean {
  if (velocity < 0) {
    return false;
  }
  return velocity > significantVelocity || offset > width / 2;
}
