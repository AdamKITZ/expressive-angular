/**
 * A TypeScript port of `Morph.match` from androidx graphics-shapes 1.0.1, the version Compose material3 1.5.0-alpha17
 * resolves (Morph.kt, FeatureMapping.kt, FloatMapping.kt, PolygonMeasure.kt): it pairs the cubics of two shapes so
 * that each corner meets a corner of the other, measuring progress along the outline by the angle around the centre.
 */

import { MaterialShape, ShapeFeature } from './material-shapes';

type Cubic = number[];

interface ProgressableFeature {
  readonly progress: number;
  readonly feature: ShapeFeature;
}

interface MeasuredCubic {
  readonly cubic: Cubic;
  readonly start: number;
  end: number;
  readonly size: number;
  readonly measurer: Measurer;
}

interface MeasuredPolygon {
  readonly measurer: Measurer;
  readonly cubics: MeasuredCubic[];
  readonly features: ProgressableFeature[];
}

const DISTANCE_EPSILON = 1e-4;
const ANGLE_EPSILON = 1e-6;
const TWO_PI = 2 * Math.PI;

interface Measurer {
  measureCubic(cubic: Cubic): number;
  findCubicCutPoint(cubic: Cubic, measure: number): number;
}

/** The matched cubics of a morph from `start` to `end`, each flattened to eight numbers per cubic. */
export function matchShapes(start: MaterialShape, end: MaterialShape): { start: number[]; end: number[] } {
  const measured1 = measurePolygon(start);
  const measured2 = measurePolygon(end);
  const mapper = featureMapper(measured1.features, measured2.features);
  const cutPoint = mapper.map(0);
  const bs1 = measured1;
  const bs2 = cutAndShift(measured2, cutPoint);

  const startCubics: number[] = [];
  const endCubics: number[] = [];
  let i1 = 0;
  let i2 = 0;
  let b1: MeasuredCubic | undefined = bs1.cubics[i1++];
  let b2: MeasuredCubic | undefined = bs2.cubics[i2++];
  while (b1 && b2) {
    const b1a = i1 === bs1.cubics.length ? 1 : b1.end;
    const b2a = i2 === bs2.cubics.length ? 1 : mapper.mapBack(positiveModulo(b2.end + cutPoint, 1));
    const minb = Math.min(b1a, b2a);
    let seg1: MeasuredCubic;
    let seg2: MeasuredCubic;
    if (b1a > minb + ANGLE_EPSILON) {
      [seg1, b1] = cutAtProgress(b1, minb);
    } else {
      seg1 = b1;
      b1 = bs1.cubics[i1++];
    }
    if (b2a > minb + ANGLE_EPSILON) {
      [seg2, b2] = cutAtProgress(b2, positiveModulo(mapper.map(minb) - cutPoint, 1));
    } else {
      seg2 = b2;
      b2 = bs2.cubics[i2++];
    }
    startCubics.push(...seg1.cubic);
    endCubics.push(...seg2.cubic);
  }
  return { start: startCubics, end: endCubics };
}

function measurePolygon({ features, center }: MaterialShape): MeasuredPolygon {
  const measurer = angleMeasurer(center[0], center[1]);
  const cubics: Cubic[] = [];
  const featureToCubic: [ShapeFeature, number][] = [];
  for (const feature of features) {
    const count = feature.cubics.length / 8;
    for (let index = 0; index < count; index++) {
      if (feature.type !== 'edge' && index === Math.floor(count / 2)) {
        featureToCubic.push([feature, cubics.length]);
      }
      cubics.push(feature.cubics.slice(index * 8, index * 8 + 8));
    }
  }
  const measures = [0];
  for (const cubic of cubics) {
    measures.push(measures[measures.length - 1] + measurer.measureCubic(cubic));
  }
  const total = measures[measures.length - 1];
  const outlineProgress = measures.map((measure) => measure / total);
  const progressable = featureToCubic.map(([feature, ix]) => ({
    progress: (outlineProgress[ix] + outlineProgress[ix + 1]) / 2,
    feature,
  }));
  return measuredPolygon(measurer, progressable, cubics, outlineProgress);
}

function measuredPolygon(
  measurer: Measurer,
  features: ProgressableFeature[],
  cubics: Cubic[],
  outlineProgress: number[]
): MeasuredPolygon {
  const measured: MeasuredCubic[] = [];
  let start = 0;
  cubics.forEach((cubic, index) => {
    if (outlineProgress[index + 1] - outlineProgress[index] > DISTANCE_EPSILON) {
      measured.push({ cubic, start, end: outlineProgress[index + 1], size: measurer.measureCubic(cubic), measurer });
      start = outlineProgress[index + 1];
    }
  });
  measured[measured.length - 1].end = 1;
  return { measurer, cubics: measured, features };
}

function cutAndShift(polygon: MeasuredPolygon, cuttingPoint: number): MeasuredPolygon {
  if (cuttingPoint < DISTANCE_EPSILON) {
    return polygon;
  }
  const { measurer, cubics, features } = polygon;
  const targetIndex = cubics.findIndex((cubic) => cuttingPoint >= cubic.start && cuttingPoint <= cubic.end);
  const [b1, b2] = cutAtProgress(cubics[targetIndex], cuttingPoint);
  const shifted = [b2.cubic];
  for (let i = 1; i < cubics.length; i++) {
    shifted.push(cubics[(i + targetIndex) % cubics.length].cubic);
  }
  shifted.push(b1.cubic);
  const outlineProgress = [0];
  for (let index = 1; index <= cubics.length; index++) {
    outlineProgress.push(positiveModulo(cubics[(targetIndex + index - 1) % cubics.length].end - cuttingPoint, 1));
  }
  outlineProgress.push(1);
  const shiftedFeatures = features.map(({ progress, feature }) => ({
    progress: positiveModulo(progress - cuttingPoint, 1),
    feature,
  }));
  return measuredPolygon(measurer, shiftedFeatures, shifted, outlineProgress);
}

function cutAtProgress(measured: MeasuredCubic, cut: number): [MeasuredCubic, MeasuredCubic] {
  const { measurer } = measured;
  const bounded = Math.min(Math.max(cut, measured.start), measured.end);
  const relative = (bounded - measured.start) / (measured.end - measured.start);
  const t = measurer.findCubicCutPoint(measured.cubic, relative * measured.size);
  const [c1, c2] = split(measured.cubic, t);
  return [
    { cubic: c1, start: measured.start, end: bounded, size: measurer.measureCubic(c1), measurer },
    { cubic: c2, start: bounded, end: measured.end, size: measurer.measureCubic(c2), measurer },
  ];
}

function angleMeasurer(centerX: number, centerY: number): Measurer {
  const angleAt = (x: number, y: number): number => angle(x - centerX, y - centerY);
  return {
    measureCubic: (c): number => {
      const measure = positiveModulo(angleAt(c[6], c[7]) - angleAt(c[0], c[1]), TWO_PI);
      return measure > TWO_PI - DISTANCE_EPSILON ? 0 : measure;
    },
    findCubicCutPoint: (c, measure): number => {
      const angle0 = angleAt(c[0], c[1]);
      return findMinimum(0, 1, 1e-5, (t) => {
        const [x, y] = pointOnCurve(c, t);
        return Math.abs(positiveModulo(angleAt(x, y) - angle0, TWO_PI) - measure);
      });
    },
  };
}

function angle(x: number, y: number): number {
  return (Math.atan2(y, x) + TWO_PI) % TWO_PI;
}

/** Ternary search for the minimum of `f` between `v0` and `v1`, as graphics-shapes' `findMinimum`. */
function findMinimum(v0: number, v1: number, tolerance: number, f: (value: number) => number): number {
  let a = v0;
  let b = v1;
  while (b - a > tolerance) {
    const c1 = (2 * a + b) / 3;
    const c2 = (2 * b + a) / 3;
    if (f(c1) < f(c2)) {
      b = c2;
    } else {
      a = c1;
    }
  }
  return (a + b) / 2;
}

function pointOnCurve(c: Cubic, t: number): [number, number] {
  const u = 1 - t;
  return [
    c[0] * u * u * u + c[2] * 3 * t * u * u + c[4] * 3 * t * t * u + c[6] * t * t * t,
    c[1] * u * u * u + c[3] * 3 * t * u * u + c[5] * 3 * t * t * u + c[7] * t * t * t,
  ];
}

function split(c: Cubic, t: number): [Cubic, Cubic] {
  const u = 1 - t;
  const [x, y] = pointOnCurve(c, t);
  return [
    [
      c[0],
      c[1],
      c[0] * u + c[2] * t,
      c[1] * u + c[3] * t,
      c[0] * u * u + c[2] * 2 * u * t + c[4] * t * t,
      c[1] * u * u + c[3] * 2 * u * t + c[5] * t * t,
      x,
      y,
    ],
    [
      x,
      y,
      c[2] * u * u + c[4] * 2 * u * t + c[6] * t * t,
      c[3] * u * u + c[5] * 2 * u * t + c[7] * t * t,
      c[4] * u + c[6] * t,
      c[5] * u + c[7] * t,
      c[6],
      c[7],
    ],
  ];
}

interface DoubleMapper {
  map(x: number): number;
  mapBack(x: number): number;
}

function featureMapper(features1: ProgressableFeature[], features2: ProgressableFeature[]): DoubleMapper {
  const corners1 = features1.filter(({ feature }) => feature.type !== 'edge');
  const corners2 = features2.filter(({ feature }) => feature.type !== 'edge');
  const [m1, m2] =
    corners1.length > corners2.length
      ? [doMapping(corners2, corners1), corners2]
      : [corners1, doMapping(corners1, corners2)];
  const pairs = m1.slice(0, m2.length);
  const source = pairs.map(({ progress }) => progress);
  const target = pairs.map((_, i) => m2[i].progress);
  return { map: (x) => linearMap(source, target, x), mapBack: (x) => linearMap(target, source, x) };
}

/** For each of `f1`'s corners in order, the nearest of `f2`'s corners that keeps the order around the outline. */
function doMapping(f1: ProgressableFeature[], f2: ProgressableFeature[]): ProgressableFeature[] {
  const m = f1.length;
  const n = f2.length;
  const ix = minBy(0, n - 1, (i) => featureDistSquared(f1[0].feature, f2[i].feature));
  const mapped = [f2[ix]];
  let lastPicked = ix;
  for (let i = 1; i < m; i++) {
    let last = ix - (m - i);
    if (last <= lastPicked) last += n;
    const best = minBy(lastPicked + 1, last, (j) => featureDistSquared(f1[i].feature, f2[j % n].feature));
    mapped.push(f2[best % n]);
    lastPicked = best;
  }
  return mapped;
}

function minBy(from: number, to: number, distance: (i: number) => number): number {
  let best = from;
  for (let i = from + 1; i <= to; i++) {
    if (distance(i) < distance(best)) best = i;
  }
  return best;
}

function featureDistSquared(f1: ShapeFeature, f2: ShapeFeature): number {
  if (f1.type !== 'edge' && f2.type !== 'edge' && f1.type !== f2.type) {
    return Infinity;
  }
  const [x1, y1] = representativePoint(f1);
  const [x2, y2] = representativePoint(f2);
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

function representativePoint({ cubics }: ShapeFeature): [number, number] {
  return [(cubics[0] + cubics[cubics.length - 2]) / 2, (cubics[1] + cubics[cubics.length - 1]) / 2];
}

function linearMap(xValues: number[], yValues: number[], x: number): number {
  const n = xValues.length;
  const start = xValues.findIndex((_, i) => progressInRange(x, xValues[i], xValues[(i + 1) % n]));
  const end = (start + 1) % n;
  const sizeX = positiveModulo(xValues[end] - xValues[start], 1);
  const sizeY = positiveModulo(yValues[end] - yValues[start], 1);
  const position = sizeX < 0.001 ? 0.5 : positiveModulo(x - xValues[start], 1) / sizeX;
  return positiveModulo(yValues[start] + sizeY * position, 1);
}

function progressInRange(progress: number, from: number, to: number): boolean {
  return to >= from ? progress >= from && progress <= to : progress >= from || progress <= to;
}

function positiveModulo(num: number, mod: number): number {
  return ((num % mod) + mod) % mod;
}
