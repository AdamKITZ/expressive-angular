import { expShapePath } from './shape';

describe('expShapePath', () => {
  it('scales the unit-square shape to the size', () => {
    const numbers = (path: string): number[] => path.match(/-?[\d.]+/g)!.map(Number);
    const unit = numbers(expShapePath('cookie9Sided'));
    const scaled = numbers(expShapePath('cookie9Sided', 48));

    scaled.forEach((value, i) => expect(value).toBeCloseTo(unit[i] * 48, 2));
    expect(Math.max(...unit)).toBeLessThanOrEqual(1);
  });
});
