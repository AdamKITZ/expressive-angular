import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';

import { DOT_SIZE, SliderFrame, sliderFrame, trackPath, TrackPiece } from './frame';

/** SliderTokens: the thumb is narrower while pressed, dragged or focused from the keyboard. */
const THUMB_WIDTH = 4;
const PRESSED_THUMB_WIDTH = 2;

interface SliderState {
  fraction: number;
  ticks: number[];
  disabled: boolean;
}

/**
 * Compose's `Slider` around a native `<input type="range">`, which keeps the value, the forms binding, the label and
 * the accessibility: `<exp-slider><input type="range" aria-label="Volume" formControlName="volume" /></exp-slider>`.
 * Without a `step` attribute the slider is continuous (it sets `step="any"`); with one it snaps to the steps and
 * shows a dot for each, like Compose's `steps`. Fills its width; colour it with `color`.
 */
@Component({
  selector: 'exp-slider',
  template: `
    <svg
      class="exp-slider-track"
      aria-hidden="true"
      [style.inset-inline-start.px]="thumbWidth() / 2"
      [style.width.px]="trackWidth()"
    >
      @if (frame().inactive; as piece) {
        <path class="exp-slider-inactive" [attr.d]="path(piece)" />
      }
      @if (frame().active; as piece) {
        <path class="exp-slider-active" [attr.d]="path(piece)" />
      }
      @if (frame().stop; as cx) {
        <circle class="exp-slider-stop" [attr.cx]="cx" cy="8" [attr.r]="dot" />
      }
      @for (tick of frame().ticks; track tick.cx) {
        <circle
          [class]="tick.active ? 'exp-slider-tick-active' : 'exp-slider-tick'"
          [attr.cx]="tick.cx"
          cy="8"
          [attr.r]="dot"
        />
      }
    </svg>
    <div class="exp-slider-thumb" [style.inset-inline-start.px]="frame().thumb" [style.width.px]="thumbWidth()"></div>
    <ng-content />
  `,
  styles: `
    exp-slider {
      position: relative;
      display: block;
      height: 48px;
      color: var(--mat-sys-primary);
    }

    .exp-slider-track {
      position: absolute;
      top: 16px;
      height: 16px;
      overflow: visible;
      pointer-events: none;
    }

    exp-slider:dir(rtl) .exp-slider-track {
      scale: -1 1;
    }

    .exp-slider-active,
    .exp-slider-stop,
    .exp-slider-tick {
      fill: currentColor;
    }

    .exp-slider-inactive,
    .exp-slider-tick-active {
      fill: var(--mat-sys-secondary-container);
    }

    .exp-slider-thumb {
      position: absolute;
      top: 2px;
      height: 44px;
      border-radius: 9999px;
      background: currentColor;
      pointer-events: none;
    }

    exp-slider > input[type='range'] {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      opacity: 0;
      cursor: pointer;
      appearance: none;
    }

    /* The native thumb as wide as the drawn one, so a pointer maps to the same value as in Compose. */
    exp-slider > input[type='range']::-webkit-slider-thumb {
      width: 4px;
      height: 44px;
      appearance: none;
    }

    exp-slider > input[type='range']::-moz-range-thumb {
      width: 4px;
      height: 44px;
      border: 0;
    }

    exp-slider.exp-slider-disabled {
      color: color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent);
    }

    exp-slider.exp-slider-disabled > input[type='range'] {
      cursor: default;
    }

    .exp-slider-disabled .exp-slider-thumb {
      background: color-mix(in srgb, var(--mat-sys-on-surface) 38%, var(--mat-sys-surface));
    }

    .exp-slider-disabled .exp-slider-inactive,
    .exp-slider-disabled .exp-slider-tick-active {
      fill: color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent);
    }
  `,
  host: {
    '[class.exp-slider-disabled]': 'state().disabled',
    '(pointerdown)': 'pressed.set(!state().disabled)',
    '(document:pointerup)': 'pressed.set(false)',
    '(document:pointercancel)': 'pressed.set(false)',
    '(focusin)': 'focusVisible.set(rangeInput().matches(":focus-visible"))',
    '(focusout)': 'focusVisible.set(false)',
    '(keydown)': 'onKeydown($event)',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpSlider implements OnInit {
  protected readonly dot: number = DOT_SIZE / 2;
  protected readonly state: WritableSignal<SliderState> = signal({ fraction: 0, ticks: [], disabled: false });
  protected readonly pressed: WritableSignal<boolean> = signal(false);
  protected readonly focusVisible: WritableSignal<boolean> = signal(false);
  private readonly width: WritableSignal<number> = signal(0);

  protected readonly thumbWidth: Signal<number> = computed(() =>
    this.pressed() || this.focusVisible() ? PRESSED_THUMB_WIDTH : THUMB_WIDTH
  );
  protected readonly trackWidth: Signal<number> = computed(() => Math.max(0, this.width() - this.thumbWidth()));
  protected readonly frame: Signal<SliderFrame> = computed(() =>
    sliderFrame({ width: this.trackWidth(), thumbWidth: this.thumbWidth(), ...this.state() })
  );

  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const input = this.rangeInput();
      const read = (): void => this.state.set(readInput(input));

      // Forms and bindings set `value` without an event, so the slider hears about it through the property.
      const value = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      Object.defineProperty(input, 'value', {
        configurable: true,
        get: () => value?.get?.call(input) as string,
        set: (next: string) => {
          value?.set?.call(input, next);
          read();
        },
      });
      input.addEventListener('input', read);
      const attributes = new MutationObserver(read);
      attributes.observe(input, { attributes: true, attributeFilter: ['min', 'max', 'step', 'disabled'] });
      const size = new ResizeObserver(() => this.width.set(this.host.clientWidth));
      size.observe(this.host);
      read();

      destroyRef.onDestroy(() => {
        attributes.disconnect();
        size.disconnect();
      });
    });
  }

  /**
   * Runs before the input's own bindings and form directives, so their first value is not rounded to the native
   * default step of 1. A value written in the template was rounded when the element was created, so it is set again.
   */
  public ngOnInit(): void {
    const input = this.rangeInput();
    if (input.hasAttribute('step')) return;
    input.step = 'any';
    const initial = input.getAttribute('value');
    if (initial !== null) input.value = initial;
  }

  protected path(piece: TrackPiece): string {
    return trackPath(piece);
  }

  /**
   * Compose moves a continuous slider by 1 % of its range per key and a stepped one by a step; Page Up and Page Down
   * move by a tenth of the steps, at least one and at most ten.
   */
  protected onKeydown(event: KeyboardEvent): void {
    const input = this.rangeInput();
    if (event.target !== input || input.disabled) return;
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const ticks = this.state().ticks.length;
    const steps = ticks > 0 ? ticks - 1 : 100;
    const delta = (max - min) / steps;
    const page = Math.min(Math.max(Math.floor(steps / 10), 1), 10) * delta;
    const forward = getComputedStyle(this.host).direction === 'rtl' ? -1 : 1;
    const current = Number(input.value);
    const next = {
      ArrowRight: current + forward * delta,
      ArrowLeft: current - forward * delta,
      ArrowUp: current + delta,
      ArrowDown: current - delta,
      PageUp: current + page,
      PageDown: current - page,
      Home: min,
      End: max,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    input.value = `${Math.min(Math.max(next, min), max)}`;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  protected rangeInput(): HTMLInputElement {
    const input = this.host.querySelector<HTMLInputElement>('input[type="range"]');
    if (!input) throw new Error('exp-slider needs an <input type="range"> inside.');
    return input;
  }
}

function readInput(input: HTMLInputElement): SliderState {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const range = max - min;
  const fraction = range > 0 ? Math.min(Math.max((Number(input.value) - min) / range, 0), 1) : 0;
  const step = Number(input.step);
  const count = step > 0 ? Math.round(range / step) : 0;
  const ticks = count > 1 ? Array.from({ length: count + 1 }, (_, i) => i / count) : [];
  return { fraction, ticks, disabled: input.disabled };
}
