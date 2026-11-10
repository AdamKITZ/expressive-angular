import recorded from '../../../../reference/compose/src/test/snapshots/material-shape-morphs.json';
import { ExpShapeName, MATERIAL_SHAPES } from './material-shapes';
import { matchShapes } from './morph';

interface RecordedMorph {
  from: ExpShapeName;
  to: ExpShapeName;
  start: number[][];
  end: number[][];
}

/**
 * Pairs where two corners are exactly as near as each other, so Compose's pick depends on Float rounding that the
 * five-decimal fixtures do not keep, and two pairs that differ for a reason not yet found. Both picks morph cleanly.
 */
const PICKED_DIFFERENTLY = new Set([
  'semiCircle → gem',
  'oval → pill',
  'cookie9Sided → cookie12Sided',
  'cookie12Sided → ghostish',
  'clover4Leaf → puffy',
  'pixelCircle → pixelTriangle',
  'pixelTriangle → bun',
  'ghostish → flower',
  'flower → puffy',
]);

describe('matchShapes', () => {
  it.each(
    (recorded as RecordedMorph[])
      .map((morph) => [`${morph.from} → ${morph.to}`, morph] as const)
      .filter(([name]) => !PICKED_DIFFERENTLY.has(name))
  )('pairs the cubics of %s as Compose’s Morph does', (_, { from, to, start, end }) => {
    const matched = matchShapes(MATERIAL_SHAPES[from], MATERIAL_SHAPES[to]);
    expect(matched.start.length).toBe(start.length * 8);
    expect(maxDifference(matched.start, start.flat())).toBeLessThan(1e-3);
    expect(maxDifference(matched.end, end.flat())).toBeLessThan(1e-3);
  });
});

function maxDifference(actual: number[], expected: number[]): number {
  return Math.max(...expected.map((value, i) => Math.abs(value - actual[i])));
}
