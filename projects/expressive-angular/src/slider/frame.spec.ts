import { sliderFrame } from './frame';

const steps = [0, 0.25, 0.5, 0.75, 1];

describe('sliderFrame', () => {
  it('keeps the tracks the thumb’s half width plus 6px away from it, and ends the inactive one in a dot', () => {
    const frame = sliderFrame({ width: 200, fraction: 0.5, ticks: [], thumbWidth: 4 });
    expect(frame.thumb).toBe(100);
    expect(frame.active).toEqual({ x: 0, width: 92, startRadius: 8, endRadius: 2 });
    expect(frame.inactive).toEqual({ x: 108, width: 92, startRadius: 2, endRadius: 8 });
    expect(frame.stop).toBe(192);
  });

  it.each([
    { fraction: 0, thumb: 0 },
    { fraction: 0.25, thumb: 8 + 184 * 0.25 },
    { fraction: 1, thumb: 200 },
  ])('insets a thumb on a middle step by a corner: $fraction', ({ fraction, thumb }) => {
    expect(sliderFrame({ width: 200, fraction, ticks: steps, thumbWidth: 4 }).thumb).toBe(thumb);
  });

  it('draws a dot per step except the last and those next to the thumb, coloured by the track under it', () => {
    const { ticks } = sliderFrame({ width: 200, fraction: 0.5, ticks: steps, thumbWidth: 4 });
    expect(ticks).toEqual([
      { cx: 8, active: true },
      { cx: 54, active: true },
      { cx: 146, active: false },
    ]);
  });

  it('drops a track too short to show its rounded end', () => {
    const frame = sliderFrame({ width: 200, fraction: 0.05, ticks: [], thumbWidth: 4 });
    expect(frame.active).toBeNull();
    expect(frame.inactive).not.toBeNull();
  });
});
