import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ExpRangeSlider } from './range-slider';

@Component({
  imports: [ExpRangeSlider],
  template: `
    <exp-range-slider>
      <input type="range" aria-label="From" min="0" max="10" step="1" value="2" />
      <input type="range" aria-label="To" min="0" max="10" step="1" value="6" />
    </exp-range-slider>
  `,
})
class Host {}

/** happy-dom has no layout: the slider is 104px wide from x = 0; with the pressed 2px thumbs 0–10 maps to 1px–103px. */
class FixedWidth {
  constructor(private readonly callback: () => void) {}
  public observe(): void {
    this.callback();
  }
  public disconnect(): void {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FixedWidth);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(104);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 104, 48));
  HTMLElement.prototype.setPointerCapture = (): void => undefined;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function render(): Promise<{ slider: HTMLElement; from: HTMLInputElement; to: HTMLInputElement }> {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  const [from, to] = Array.from(element.querySelectorAll('input'));
  return { slider: element.querySelector('exp-range-slider')!, from, to };
}

describe('ExpRangeSlider', () => {
  it.each([
    { x: 12, from: '1', to: '6' },
    { x: 52, from: '2', to: '5' },
    { x: 92, from: '2', to: '9' },
  ])('moves the nearer thumb to a press at $x px', async ({ x, from, to }) => {
    const slider = await render();
    slider.slider.dispatchEvent(new PointerEvent('pointerdown', { clientX: x, button: 0, bubbles: true }));
    expect([slider.from.value, slider.to.value]).toEqual([from, to]);
  });

  it('keeps a dragged thumb from passing the other', async () => {
    const { slider, from, to } = await render();
    slider.dispatchEvent(new PointerEvent('pointerdown', { clientX: 22, button: 0, bubbles: true }));
    slider.dispatchEvent(new PointerEvent('pointermove', { clientX: 92, bubbles: true }));
    expect([from.value, to.value]).toEqual(['6', '6']);
  });

  it.each([
    { thumb: 0, key: 'End', from: '6', to: '6' },
    { thumb: 1, key: 'Home', from: '2', to: '2' },
    { thumb: 1, key: 'ArrowRight', from: '2', to: '7' },
  ])('stops a key at the other thumb: $key on thumb $thumb', async ({ thumb, key, from, to }) => {
    const slider = await render();
    [slider.from, slider.to][thumb].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    expect([slider.from.value, slider.to.value]).toEqual([from, to]);
  });
});
