import { sliderFrame, SliderFrameInput, trackPath } from './frame';

const steps = [0, 0.25, 0.5, 0.75, 1];
const slider: SliderFrameInput = {
  width: 200,
  start: 0,
  end: 0.5,
  ticks: [],
  range: false,
  shrinkCorners: false,
  startThumbWidth: 0,
  endThumbWidth: 4,
};
const rangeSlider: SliderFrameInput = { ...slider, start: 0.25, end: 0.75, range: true, startThumbWidth: 4 };

describe('sliderFrame', () => {
  it('keeps the tracks the thumb’s half width plus 6px away from it, and ends the inactive one in a dot', () => {
    const frame = sliderFrame(slider);
    expect(frame.endThumb).toBe(100);
    expect(frame.pieces).toEqual([
      { x: 108, width: 92, startRadius: 2, endRadius: 8, active: false },
      { x: 0, width: 92, startRadius: 8, endRadius: 2, active: true },
    ]);
    expect(frame.stops).toEqual([192]);
  });

  it('gives a range slider an inactive track with a dot on either side and an active one between the thumbs', () => {
    const frame = sliderFrame(rangeSlider);
    expect(frame.pieces).toEqual([
      { x: 0, width: 42, startRadius: 8, endRadius: 2, active: false },
      { x: 158, width: 42, startRadius: 2, endRadius: 8, active: false },
      { x: 58, width: 84, startRadius: 2, endRadius: 2, active: true },
    ]);
    expect(frame.stops).toEqual([8, 192]);
  });

  it.each([
    { end: 0, thumb: 0 },
    { end: 0.25, thumb: 8 + 184 * 0.25 },
    { end: 1, thumb: 200 },
  ])('insets a thumb on a middle step by a corner: $end', ({ end, thumb }) => {
    expect(sliderFrame({ ...slider, end, ticks: steps }).endThumb).toBe(thumb);
  });

  it.each([
    {
      input: { ...slider, ticks: steps },
      ticks: [
        { cx: 8, active: true },
        { cx: 54, active: true },
        { cx: 146, active: false },
      ],
    },
    {
      input: { ...rangeSlider, end: 1, ticks: steps },
      ticks: [
        { cx: 100, active: true },
        { cx: 146, active: true },
      ],
    },
  ])('draws a dot per step except at the ends and next to a thumb', ({ input, ticks }) => {
    expect(sliderFrame(input).ticks).toEqual(ticks);
  });

  it('drops a track too short to show its rounded end', () => {
    const { pieces } = sliderFrame({ ...slider, end: 0.05 });
    expect(pieces.map((piece) => piece.active)).toEqual([false]);
  });

  it('keeps a short track when its corners shrink, as on a vertical slider without steps', () => {
    const { pieces } = sliderFrame({ ...slider, end: 0.05, shrinkCorners: true });
    expect(pieces.map((piece) => piece.active)).toEqual([false, true]);
  });

  it('shrinks both corners of a piece shorter than they are, as Compose’s rounded rectangle does', () => {
    const path = trackPath({ x: 0, width: 5, startRadius: 8, endRadius: 2, active: true });
    expect(path).toBe(trackPath({ x: 0, width: 5, startRadius: 4, endRadius: 1, active: true }));
  });
});
