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
import { EMPTY_READING, PRESSED_THUMB_WIDTH, THUMB_WIDTH } from './slider';

type Thumb = 'start' | 'end';

/**
 * Compose's `RangeSlider` around two native `<input type="range">`, the first for the start of the range and the
 * second for its end, with the same `min`, `max` and `step`:
 * `<exp-range-slider><input type="range" aria-label="From" formControlName="from" /><input type="range"
 * aria-label="To" formControlName="to" /></exp-range-slider>`. A press moves the nearer thumb, and neither thumb
 * passes the other. Fills its width; colour it with `color`.
 */
@Component({
  selector: 'exp-range-slider',
  template: `
    <svg
      class="exp-slider-track"
      aria-hidden="true"
      [style.inset-inline-start.px]="startThumbWidth() / 2"
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
      [style.inset-inline-start.px]="frame().startThumb"
      [style.width.px]="startThumbWidth()"
    ></div>
    <div
      class="exp-slider-thumb"
      [style.inset-inline-start.px]="startThumbWidth() / 2 + frame().endThumb - endThumbWidth() / 2"
      [style.width.px]="endThumbWidth()"
    ></div>
    <ng-content />
  `,
  styleUrl: './slider.scss',
  host: {
    class: 'exp-slider exp-range-slider',
    '[class.exp-slider-disabled]': 'disabled()',
    '(pointerdown)': 'onPointerdown($event)',
    '(pointermove)': 'onPointermove($event)',
    '(pointerup)': 'onPointerup()',
    '(pointercancel)': 'onPointerup()',
    '(focusin)': 'onFocusin($event)',
    '(focusout)': 'focusVisible.set(null)',
    '(keydown)': 'onKeydown($event)',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpRangeSlider implements OnInit {
  protected readonly dot: number = DOT_SIZE / 2;
  private readonly start: WritableSignal<RangeReading> = signal(EMPTY_READING);
  private readonly end: WritableSignal<RangeReading> = signal(EMPTY_READING);
  private readonly pressed: WritableSignal<Thumb | null> = signal(null);
  protected readonly focusVisible: WritableSignal<Thumb | null> = signal(null);
  private readonly width: WritableSignal<number> = signal(0);

  protected readonly disabled: Signal<boolean> = computed(() => this.start().disabled || this.end().disabled);
  protected readonly startThumbWidth: Signal<number> = computed(() => this.thumbWidth('start'));
  protected readonly endThumbWidth: Signal<number> = computed(() => this.thumbWidth('end'));
  protected readonly trackWidth: Signal<number> = computed(() =>
    Math.max(0, this.width() - (this.startThumbWidth() + this.endThumbWidth()) / 2)
  );
  protected readonly frame: Signal<SliderFrame> = computed(() =>
    sliderFrame({
      width: this.trackWidth(),
      start: this.start().fraction,
      end: this.end().fraction,
      ticks: this.start().ticks,
      range: true,
      shrinkCorners: false,
      startThumbWidth: this.startThumbWidth(),
      endThumbWidth: this.endThumbWidth(),
    })
  );

  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const [start, end] = this.inputs();
      const read = (): void => {
        this.start.set(readRange(start));
        this.end.set(readRange(end));
      };
      watchRange(start, read, destroyRef);
      watchRange(end, read, destroyRef);
      const size = new ResizeObserver(() => this.width.set(this.host.clientWidth));
      size.observe(this.host);
      destroyRef.onDestroy(() => size.disconnect());
      read();
    });
  }

  public ngOnInit(): void {
    this.inputs().forEach(makeContinuous);
  }

  protected path(piece: TrackPiece): string {
    return trackPath(piece);
  }

  /** Compose picks the nearer thumb; between two thumbs on one spot, the start one when the press is before it. */
  protected onPointerdown(event: PointerEvent): void {
    if (this.disabled() || event.button !== 0) return;
    const at = this.pointerAt(event);
    const half = this.startThumbWidth() / 2;
    const toStart = Math.abs(half + this.frame().startThumb - at);
    const toEnd = Math.abs(half + this.frame().endThumb - at);
    const thumb: Thumb =
      toStart !== toEnd ? (toStart < toEnd ? 'start' : 'end') : half + this.frame().startThumb > at ? 'start' : 'end';
    event.preventDefault();
    this.host.setPointerCapture(event.pointerId);
    this.pressed.set(thumb);
    this.input(thumb).focus({ preventScroll: true });
    this.moveTo(thumb, at);
  }

  protected onPointermove(event: PointerEvent): void {
    const thumb = this.pressed();
    if (thumb) this.moveTo(thumb, this.pointerAt(event));
  }

  protected onPointerup(): void {
    const thumb = this.pressed();
    if (!thumb) return;
    this.pressed.set(null);
    this.input(thumb).dispatchEvent(new Event('change', { bubbles: true }));
  }

  protected onFocusin(event: FocusEvent): void {
    const [start, end] = this.inputs();
    const target = event.target as HTMLInputElement;
    if (!target.matches(':focus-visible')) return;
    this.focusVisible.set(target === start ? 'start' : target === end ? 'end' : null);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const [start, end] = this.inputs();
    const thumb: Thumb | null = event.target === start ? 'start' : event.target === end ? 'end' : null;
    if (!thumb || this.disabled()) return;
    const reading = readRange(this.input(thumb));
    const [lower, upper] = thumb === 'start' ? [reading.min, Number(end.value)] : [Number(start.value), reading.max];
    const next = valueForKey(event.key, reading, this.rtl() ? 'rtl' : 'ltr', lower, upper);
    if (next === undefined) return;
    event.preventDefault();
    commit(this.input(thumb), next, ['input', 'change']);
  }

  private thumbWidth(thumb: Thumb): number {
    return this.pressed() === thumb || this.focusVisible() === thumb ? PRESSED_THUMB_WIDTH : THUMB_WIDTH;
  }

  /** Moves a thumb to a position along the slider, between the ends and short of the other thumb. */
  private moveTo(thumb: Thumb, at: number): void {
    const [start, end] = this.inputs();
    const { min, max, ticks } = readRange(start);
    const from = this.startThumbWidth() / 2;
    const to = this.width() - this.endThumbWidth() / 2;
    const raw = to > from ? Math.min(Math.max((at - from) / (to - from), 0), 1) : 0;
    const fraction = ticks.length > 0 ? ticks.reduce((a, b) => (Math.abs(b - raw) < Math.abs(a - raw) ? b : a)) : raw;
    const value = min + (max - min) * fraction;
    const next = thumb === 'start' ? Math.min(value, Number(end.value)) : Math.max(value, Number(start.value));
    const input = this.input(thumb);
    const before = input.value;
    input.value = `${next}`;
    if (input.value !== before) input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private pointerAt(event: PointerEvent): number {
    const { left, width } = this.host.getBoundingClientRect();
    return this.rtl() ? left + width - event.clientX : event.clientX - left;
  }

  private rtl(): boolean {
    return getComputedStyle(this.host).direction === 'rtl';
  }

  private input(thumb: Thumb): HTMLInputElement {
    return this.inputs()[thumb === 'start' ? 0 : 1];
  }

  private inputs(): [HTMLInputElement, HTMLInputElement] {
    const inputs = this.host.querySelectorAll<HTMLInputElement>('input[type="range"]');
    if (inputs.length !== 2) throw new Error('exp-range-slider needs two <input type="range"> inside.');
    return [inputs[0], inputs[1]];
  }
}
