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

import { amplitudeAt, AmplitudeTransition, waveAmplitude } from '../linear-progress/frame';
import { circularProgressFrame, CircularStroke, indeterminateCircle, vertexCount } from './frame';

/**
 * Compose's `CircularProgressIndicator` (40px), or with `wavy` its `CircularWavyProgressIndicator` (48px):
 * determinate with a `value` from 0 to 100, indeterminate without one. Size it with `width` and `height`, colour it
 * with `color`. Give it an `aria-label`.
 */
@Component({
  selector: 'exp-circular-progress',
  template: `
    <svg aria-hidden="true" #svg>
      <g #group>
        <path #track class="track" />
        <path #indicator />
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      width: 40px;
      height: 40px;
      color: var(--mat-sys-primary);
    }

    :host(.exp-circular-progress-wavy) {
      width: 48px;
      height: 48px;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
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

    /* Compose's flat indeterminate indicator has a transparent track. */
    :host(:not(.exp-circular-progress-wavy):not([aria-valuenow])) .track {
      display: none;
    }
  `,
  host: {
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'percent()',
    '[class.exp-circular-progress-wavy]': 'wavy()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpCircularProgress {
  public readonly value: InputSignal<number | undefined> = input<number | undefined>(undefined);
  public readonly wavy: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  protected readonly percent: Signal<number | null> = computed(() => {
    const value = this.value();
    return value === undefined ? null : Math.min(Math.max(value, 0), 100);
  });

  private readonly svg: Signal<ElementRef<SVGSVGElement>> = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private readonly group: Signal<ElementRef<SVGGElement>> = viewChild.required<ElementRef<SVGGElement>>('group');
  private readonly track: Signal<ElementRef<SVGPathElement>> = viewChild.required<ElementRef<SVGPathElement>>('track');
  private readonly indicator: Signal<ElementRef<SVGPathElement>> =
    viewChild.required<ElementRef<SVGPathElement>>('indicator');

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const set = (element: Element, name: string, value: string): void => {
        if (element.getAttribute(name) !== value) element.setAttribute(name, value);
      };
      const stroke = (element: SVGPathElement, { d, length, visible, offset }: CircularStroke): void => {
        set(element, 'd', visible > 0 ? d : '');
        set(element, 'pathLength', `${length}`);
        set(element, 'stroke-dasharray', `${visible} ${length}`);
        set(element, 'stroke-dashoffset', `${offset}`);
      };
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      // Date.now rather than the frame timestamp, so a test can pin the animation with Playwright's setFixedTime.
      const start = Date.now();
      let amplitude: AmplitudeTransition | null = null;
      let morphed = false;
      let frameId = 0;

      const draw = (): void => {
        const elapsedMs = Date.now() - start;
        const percent = this.percent();
        const wavy = this.wavy();
        const size = host.clientWidth;
        const circle = percent === null ? indeterminateCircle(elapsedMs) : { progress: percent / 100, rotation: 0 };

        let currentAmplitude = 0;
        if (wavy) {
          const target = percent === null ? 1 : waveAmplitude(circle.progress);
          if (amplitude?.to !== target) {
            morphed = amplitude !== null;
            amplitude = { from: amplitude ? amplitudeAt(amplitude, elapsedMs) : target, to: target, since: elapsedMs };
          }
          currentAmplitude = reducedMotion.matches ? target : amplitudeAt(amplitude, elapsedMs);
        }

        const frame = circularProgressFrame({
          size,
          wavy,
          progress: circle.progress,
          rotation: circle.rotation,
          amplitude: currentAmplitude,
          // One wavelength per second, like Compose's default wave speed: once around in one second per wave.
          waveOffset: reducedMotion.matches ? 0 : (elapsedMs / (1000 * vertexCount(size))) % 1,
          morphed,
        });
        const centre = size / 2;
        set(this.svg().nativeElement, 'viewBox', `0 0 ${size} ${size}`);
        set(this.group().nativeElement, 'transform', `rotate(${frame.rotation} ${centre} ${centre})`);
        stroke(this.track().nativeElement, frame.track);
        stroke(this.indicator().nativeElement, frame.indicator);
        set(this.indicator().nativeElement, 'transform', `rotate(${frame.indicator.rotation} ${centre} ${centre})`);
        frameId = requestAnimationFrame(draw);
      };
      draw();
      destroyRef.onDestroy(() => cancelAnimationFrame(frameId));
    });
  }
}
