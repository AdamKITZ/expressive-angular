/**
 * Widths while the button at `index` is pressed: it grows by `ratio` of its width and its neighbours give up that
 * space, a middle button's two neighbours half each. Mirrors Compose's `ButtonGroup` measure policy.
 */
export function pressedWidths(widths: number[], index: number, ratio: number): number[] {
  const neighbours = [index - 1, index + 1].filter((i) => i >= 0 && i < widths.length);
  const growth = widths[index] * ratio;
  return widths.map((width, i) => {
    if (i === index) return neighbours.length > 0 ? width + growth : width;
    return neighbours.includes(i) ? width - growth / neighbours.length : width;
  });
}
