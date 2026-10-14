import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ExpSlider } from './slider';

@Component({
  imports: [ExpSlider],
  template: `<exp-slider><input type="range" aria-label="Volume" min="0" max="10" value="5" /></exp-slider>`,
})
class Continuous {}

@Component({
  imports: [ExpSlider],
  template: `<exp-slider><input type="range" aria-label="Volume" min="0" max="10" step="2" value="4" /></exp-slider>`,
})
class Stepped {}

@Component({
  imports: [ExpSlider],
  template: `<exp-slider vertical><input type="range" aria-label="Volume" min="0" max="10" value="5" /></exp-slider>`,
})
class Vertical {}

@Component({
  imports: [ExpSlider],
  template: `
    <exp-slider vertical reverse><input type="range" aria-label="Volume" min="0" max="10" value="5" /></exp-slider>
  `,
})
class Reversed {}

/** happy-dom has no layout: the slider is 204px long, so its track is 200px. */
class FixedWidth {
  constructor(private readonly callback: () => void) {}
  public observe(): void {
    this.callback();
  }
  public disconnect(): void {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', FixedWidth);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(204);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(204);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function press(host: typeof Continuous, key: string): Promise<string> {
  const fixture = TestBed.createComponent(host);
  await fixture.whenStable();
  const input = (fixture.nativeElement as HTMLElement).querySelector('input')!;
  input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  return input.value;
}

describe('ExpSlider', () => {
  it.each([
    { host: Continuous, key: 'ArrowRight', value: '5.1' },
    { host: Continuous, key: 'ArrowDown', value: '4.9' },
    { host: Continuous, key: 'PageUp', value: '6' },
    { host: Continuous, key: 'End', value: '10' },
    { host: Stepped, key: 'ArrowLeft', value: '2' },
    { host: Stepped, key: 'PageUp', value: '6' },
    { host: Vertical, key: 'ArrowDown', value: '5.1' },
    { host: Vertical, key: 'PageUp', value: '4' },
    { host: Reversed, key: 'ArrowUp', value: '5.1' },
  ])('moves on $key like Compose', async ({ host, key, value }) => {
    expect(Number(await press(host, key))).toBeCloseTo(Number(value));
  });

  it('moves the thumb when the value is set without an event, as forms do', async () => {
    const fixture = TestBed.createComponent(Continuous);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const thumb = element.querySelector<HTMLElement>('.exp-slider-thumb')!;
    element.querySelector('input')!.value = '9';
    await fixture.whenStable();

    expect(thumb.style.insetInlineStart).toBe('180px');
  });

  it('puts the minimum at the bottom of a reversed vertical slider', async () => {
    const fixture = TestBed.createComponent(Reversed);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector('input')!.value = '9';
    await fixture.whenStable();

    expect(element.querySelector<HTMLElement>('.exp-slider-thumb')!.style.top).toBe('20px');
  });
});
