import { cubicsPath } from './cubics';
import { ExpShapeName, MATERIAL_SHAPES } from './material-shapes';

export type { ExpShapeName } from './material-shapes';

/** The names of all of Compose's `MaterialShapes`, in Compose's order. */
export const EXP_SHAPE_NAMES: readonly ExpShapeName[] = Object.keys(MATERIAL_SHAPES) as ExpShapeName[];

/**
 * The SVG path data of one of Compose's `MaterialShapes`, filling a `size` × `size` square the way `toShape()` fills
 * a square box. Use it as an `<svg>` path or, with the default size of 1, in a `<clipPath clipPathUnits="objectBoundingBox">`.
 */
export function expShapePath(name: ExpShapeName, size: number = 1): string {
  return cubicsPath(
    MATERIAL_SHAPES[name].features.flatMap(({ cubics }) => cubics),
    size
  );
}
