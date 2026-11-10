/** SVG path data for closed cubics flattened to eight numbers each (anchor, control, control, anchor), scaled by `size`. */
export function cubicsPath(points: ArrayLike<number>, size: number = 1): string {
  const at = (i: number): string => `${round(points[i] * size)} ${round(points[i + 1] * size)}`;
  const curves: string[] = [];
  for (let i = 0; i < points.length; i += 8) {
    curves.push(`C${at(i + 2)} ${at(i + 4)} ${at(i + 6)}`);
  }
  return `M${at(0)}${curves.join('')}Z`;
}

function round(value: number): number {
  return Math.round(value * 1e4) / 1e4;
}
