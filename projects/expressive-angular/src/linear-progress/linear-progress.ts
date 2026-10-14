import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  Signal,
  viewChild,
} from '@angular/core';

import { amplitudeAt, AmplitudeTransition, indeterminateFractions, linearProgressFrame, waveAmplitude } from './frame';

/**
 * Compose's `LinearProgressIndicator`, or with `wavy` its `LinearWavyProgressIndicator`: determinate with a `value`
 * from 0 to 100, indeterminate without one. Fills its width; colour it with `color`. Give it an `aria-label`.
 */
@Component({
  selector: 'exp-linear-progress',
  template: `
    <svg aria-hidden="true">
      <path #track class="track" />
      <path #first />
      <path #second />
      <circle #stop />
    </svg>
  `,
  styles: `
    :host {
      display: block;
      height: 4px;
      color: var(--mat-sys-primary);
    }

    :host(.exp-linear-progress-wavy) {
      height: 10px;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    :host(:dir(rtl)) svg {
      rotate: 180deg;
    }

    path {
      fill: none;
      stroke: currentColor;
      stroke-width: 4px;
      stroke-linecap: round;
    }

    .track {
      stroke: var(--mat-sys-secondary-container);
    }

    circle {
      fill: currentColor;
    }
  `,
  host: {
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'percent()',
    '[class.exp-linear-progress-wavy]': 'wavy()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpLinearProgress {
  public readonly value: InputSignal<number | undefined> = input<number | undefined>(undefined);
  public readonly wavy: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  protected readonly percent: Signal<number | null> = computed(() => {
    const value = this.value();
    return value === undefined ? null : Math.min(Math.max(value, 0), 100);
  });

  private readonly track: Signal<ElementRef<SVGPathElement>> = viewChild.required<ElementRef<SVGPathElement>>('track');
  private readonly first: Signal<ElementRef<SVGPathElement>> = viewChild.required<ElementRef<SVGPathElement>>('first');
  private readonly second: Signal<ElementRef<SVGPathElement>> =
    viewChild.required<ElementRef<SVGPathElement>>('second');
  private readonly stop: Signal<ElementRef<SVGCircleElement>> =
    viewChild.required<ElementRef<SVGCircleElement>>('stop');

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const set = (element: Element, name: string, value: string): void => {
        if (element.getAttribute(name) !== value) element.setAttribute(name, value);
      };
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      // Date.now rather than the frame timestamp, so a test can pin the animation with Playwright's setFixedTime.
      const start = Date.now();
      let amplitude: AmplitudeTransition | null = null;
      let frameId = 0;

      const draw = (): void => {
        const elapsedMs = Date.now() - start;
        const percent = this.percent();
        const wavy = this.wavy();
        const progress = percent === null ? null : percent / 100;

        let currentAmplitude = 0;
        if (wavy) {
          const target = progress === null ? 1 : waveAmplitude(progress);
          if (amplitude?.to !== target) {
            amplitude = { from: amplitude ? amplitudeAt(amplitude, elapsedMs) : target, to: target, since: elapsedMs };
          }
          currentAmplitude = reducedMotion.matches ? target : amplitudeAt(amplitude, elapsedMs);
        }

        const frame = linearProgressFrame({
          width: host.clientWidth,
          height: host.clientHeight,
          fractions: progress === null ? indeterminateFractions(elapsedMs) : [0, progress],
          amplitude: currentAmplitude,
          wavelength: progress === null ? 20 : 40,
          // One wavelength per second, like Compose's default wave speed.
          waveOffset: reducedMotion.matches ? 0 : (elapsedMs / 1000) % 1,
          stop: progress !== null,
        });
        set(this.track().nativeElement, 'd', frame.track);
        set(this.first().nativeElement, 'd', frame.indicators[0]);
        set(this.second().nativeElement, 'd', frame.indicators[1] ?? '');
        set(this.stop().nativeElement, 'cx', `${frame.stop?.cx ?? 0}`);
        set(this.stop().nativeElement, 'cy', `${host.clientHeight / 2}`);
        set(this.stop().nativeElement, 'r', `${frame.stop?.r ?? 0}`);
        frameId = requestAnimationFrame(draw);
      };
      draw();
      destroyRef.onDestroy(() => cancelAnimationFrame(frameId));
    });
  }
}
