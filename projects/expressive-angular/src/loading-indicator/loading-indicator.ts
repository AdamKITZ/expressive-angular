import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Signal,
  viewChild,
} from '@angular/core';

import { loadingIndicatorFrame } from './frame';

/**
 * Compose's indeterminate `LoadingIndicator` (uncontained): shapes morphing into each other while turning. 48px by
 * default; size it with `width`/`height` and colour it with `color`. Give it an `aria-label`.
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

    svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `,
  host: { role: 'progressbar' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpLoadingIndicator {
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
