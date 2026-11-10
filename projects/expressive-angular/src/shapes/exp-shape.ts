import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnDestroy,
} from '@angular/core';

import { durationMs } from '../button-group/duration-ms';
import { cubicsPath } from './cubics';
import { MATERIAL_SHAPES } from './material-shapes';
import { matchShapes } from './morph';
import { ExpShapeName, expShapePath } from './shape';

/**
 * One of Compose's `MaterialShapes`, filled with `color` (Primary by default) and 48px by default; size it with
 * `width`/`height`. When `shape` changes it morphs into the new shape as Compose's `Morph` does, with the
 * DefaultSpatial spring. Decorative: it is hidden from assistive technology.
 */
@Component({
  selector: 'exp-shape',
  template: `<svg viewBox="0 0 1 1"><path /></svg>`,
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
      overflow: visible;
      fill: currentColor;
    }
  `,
  host: { 'aria-hidden': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpShape implements OnDestroy {
  public readonly shape: InputSignal<ExpShapeName> = input.required<ExpShapeName>();

  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private shown?: ExpShapeName;
  private animation?: Animation;
  private frameId: number = 0;

  constructor() {
    effect(() => this.show(this.shape()));
  }

  public ngOnDestroy(): void {
    this.stop();
  }

  private show(shape: ExpShapeName): void {
    const from = this.shown;
    this.shown = shape;
    this.stop();
    const path = this.host.querySelector('path') as SVGPathElement;
    if (from === undefined || from === shape || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      path.setAttribute('d', expShapePath(shape));
      return;
    }

    const { start, end } = matchShapes(MATERIAL_SHAPES[from], MATERIAL_SHAPES[shape]);
    const style = getComputedStyle(this.host);
    // An empty animation only to sample the spring's easing: SVG path data has no cross-browser CSS animation.
    const animation = this.host.animate([], {
      duration: durationMs(style.getPropertyValue('--exp-motion-default-spatial-duration')),
      easing: style.getPropertyValue('--exp-motion-default-spatial'),
    });
    this.animation = animation;
    const points = new Array<number>(start.length);
    const draw = (): void => {
      const progress = animation.effect?.getComputedTiming().progress ?? 1;
      for (let i = 0; i < start.length; i++) points[i] = start[i] + (end[i] - start[i]) * progress;
      path.setAttribute('d', cubicsPath(points));
      this.frameId = requestAnimationFrame(draw);
    };
    draw();
    void animation.finished.then(
      () => {
        this.stop();
        path.setAttribute('d', expShapePath(shape));
      },
      () => undefined
    );
  }

  private stop(): void {
    cancelAnimationFrame(this.frameId);
    this.animation?.cancel();
    this.animation = undefined;
  }
}
