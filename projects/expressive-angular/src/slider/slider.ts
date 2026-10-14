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
import { commit, makeContinuous, RangeReading, readRange, valueForKey, watchRange } from './native-range';

/** SliderTokens: the thumb is narrower while pressed, dragged or focused from the keyboard. */
export const THUMB_WIDTH = 4;
export const PRESSED_THUMB_WIDTH = 2;

export const EMPTY_READING: RangeReading = { min: 0, max: 100, value: 0, fraction: 0, ticks: [], disabled: false };

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
      @for (piece of frame().pieces; track piece.x) {
        <path [class]="piece.active ? 'exp-slider-active' : 'exp-slider-inactive'" [attr.d]="path(piece)" />
      }
      @for (cx of frame().stops; track cx) {
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
    <div
      class="exp-slider-thumb"
      [style.inset-inline-start.px]="frame().endThumb"
      [style.width.px]="thumbWidth()"
    ></div>
    <ng-content />
  `,
  styleUrl: './slider.scss',
  host: {
    class: 'exp-slider',
    '[class.exp-slider-disabled]': 'reading().disabled',
    '(pointerdown)': 'pressed.set(!reading().disabled)',
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
  protected readonly reading: WritableSignal<RangeReading> = signal(EMPTY_READING);
  protected readonly pressed: WritableSignal<boolean> = signal(false);
  protected readonly focusVisible: WritableSignal<boolean> = signal(false);
  private readonly width: WritableSignal<number> = signal(0);

  protected readonly thumbWidth: Signal<number> = computed(() =>
    this.pressed() || this.focusVisible() ? PRESSED_THUMB_WIDTH : THUMB_WIDTH
  );
  protected readonly trackWidth: Signal<number> = computed(() => Math.max(0, this.width() - this.thumbWidth()));
  protected readonly frame: Signal<SliderFrame> = computed(() => {
    const { fraction, ticks } = this.reading();
    return sliderFrame({
      width: this.trackWidth(),
      start: 0,
      end: fraction,
      ticks,
      range: false,
      startThumbWidth: 0,
      endThumbWidth: this.thumbWidth(),
    });
  });

  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const input = this.rangeInput();
      const read = (): void => this.reading.set(readRange(input));
      watchRange(input, read, destroyRef);
      const size = new ResizeObserver(() => this.width.set(this.host.clientWidth));
      size.observe(this.host);
      destroyRef.onDestroy(() => size.disconnect());
      read();
    });
  }

  public ngOnInit(): void {
    makeContinuous(this.rangeInput());
  }

  protected path(piece: TrackPiece): string {
    return trackPath(piece);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const input = this.rangeInput();
    if (event.target !== input || input.disabled) return;
    const reading = readRange(input);
    const rtl = getComputedStyle(this.host).direction === 'rtl';
    const next = valueForKey(event.key, reading, rtl, reading.min, reading.max);
    if (next === undefined) return;
    event.preventDefault();
    commit(input, next, ['input', 'change']);
  }

  protected rangeInput(): HTMLInputElement {
    const input = this.host.querySelector<HTMLInputElement>('input[type="range"]');
    if (!input) throw new Error('exp-slider needs an <input type="range"> inside.');
    return input;
  }
}
