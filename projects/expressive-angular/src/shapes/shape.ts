import { ExpShapeName, MATERIAL_SHAPES } from './material-shapes';

export type { ExpShapeName } from './material-shapes';

/** The names of all of Compose's `MaterialShapes`, in Compose's order. */
export const EXP_SHAPE_NAMES: readonly ExpShapeName[] = Object.keys(MATERIAL_SHAPES) as ExpShapeName[];

/**
 * The SVG path data of one of Compose's `MaterialShapes`, filling a `size` × `size` square the way `toShape()` fills
 * a square box. Use it as an `<svg>` path or, with the default size of 1, in a `<clipPath clipPathUnits="objectBoundingBox">`.
 */
export function expShapePath(name: ExpShapeName, size: number = 1): string {
  const points = MATERIAL_SHAPES[name];
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
