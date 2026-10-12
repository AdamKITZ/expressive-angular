import { describe, expect, it } from 'vitest';

import { parseCornerValues, parseFloatTokens, springEasing } from './tokens.ts';

describe('parseFloatTokens', () => {
  it('reads every float token of a generated Kotlin token object', () => {
    const kotlin = `
      internal object ExpressiveMotionTokens {
          val SpringFastSpatialDamping = 0.6f
          val SpringFastSpatialStiffness = 800.0f
      }`;

    expect(parseFloatTokens(kotlin)).toEqual({ SpringFastSpatialDamping: 0.6, SpringFastSpatialStiffness: 800 });
  });
});

describe('parseCornerValues', () => {
  it('reads CornerSize values and ignores composite shapes', () => {
    const kotlin = `
      val CornerLargeTop =
          RoundedCornerShape(topStart = 16.0.dp, topEnd = 16.0.dp, bottomEnd = 0.0.dp, bottomStart = 0.0.dp)
      val CornerValueExtraLargeIncreased = CornerSize(32.0.dp)
      val CornerValueNone = CornerSize(0.0.dp)`;

    expect(parseCornerValues(kotlin)).toEqual({ ExtraLargeIncreased: 32, None: 0 });
  });
});

describe('springEasing', () => {
  it.each([
    { name: 'critically damped', damping: 1, stiffness: 1600, overshoots: false },
    { name: 'underdamped', damping: 0.6, stiffness: 800, overshoots: true },
  ])('a $name spring overshoots: $overshoots', ({ damping, stiffness, overshoots }) => {
    const { points } = springEasing({ damping, stiffness });

    expect(Math.max(...points) > 1).toBe(overshoots);
  });

  it('starts at 0 and ends exactly at 1', () => {
    const { points } = springEasing({ damping: 0.8, stiffness: 380 });

    expect(points[0]).toBe(0);
    expect(points.at(-1)).toBe(1);
  });

  it('settles later for a softer spring', () => {
    const stiff = springEasing({ damping: 0.8, stiffness: 380 });
    const soft = springEasing({ damping: 0.8, stiffness: 200 });

    expect(soft.durationMs).toBeGreaterThan(stiff.durationMs);
  });
});
