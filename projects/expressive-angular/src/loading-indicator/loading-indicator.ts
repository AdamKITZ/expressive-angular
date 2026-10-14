import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  InputSignalWithTransform,
  Signal,
  viewChild,
} from '@angular/core';

import { loadingIndicatorFrame } from './frame';

/**
 * Compose's indeterminate `LoadingIndicator`: shapes morphing into each other while turning. With `contained` it is
 * `ContainedLoadingIndicator`, on a round PrimaryContainer. 48px by default; size it with `width`/`height` and colour
 * it with `color` (and `background-color` when contained). Give it an `aria-label`.
 */
@Component({
  selector: 'exp-loading-indicator',
  template: `<svg viewBox="0 0 1 1" aria-hidden="true"><path #path /></svg>`,
  styles: `
    :host {
      display: inline-block;
      width: 48px;
      height: 48px;
      color: var(--mat-sys-primary);
    }

    :host(.exp-loading-indicator-contained) {
      border-radius: 50%;
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `,
  host: { role: 'progressbar', '[class.exp-loading-indicator-contained]': 'contained()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpLoadingIndicator {
  public readonly contained: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
  });

  private readonly path: Signal<ElementRef<SVGPathElement>> = viewChild.required<ElementRef<SVGPathElement>>('path');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const path = this.path().nativeElement;
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      // Date.now rather than the frame timestamp, so a test can pin the animation with Playwright's setFixedTime.
      const start = Date.now();
      let frameId = 0;
      const draw = (): void => {
        const frame = loadingIndicatorFrame(Date.now() - start, reducedMotion.matches);
        path.setAttribute('d', frame.path);
        path.setAttribute('transform', `rotate(${frame.rotation} 0.5 0.5)`);
        frameId = requestAnimationFrame(draw);
      };
      draw();
      destroyRef.onDestroy(() => cancelAnimationFrame(frameId));
    });
  }
}
