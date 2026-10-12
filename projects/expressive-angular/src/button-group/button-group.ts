import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  input,
  InputSignalWithTransform,
  model,
  ModelSignal,
  Signal,
} from '@angular/core';

import { EXP_BUTTON_GROUP, ExpButton, ExpButtonGroupRef } from '../button/button';
import { pressedWidths } from './pressed-widths';

/** `ButtonGroupDefaults.ExpandedRatio`. */
const EXPANDED_RATIO = 0.15;

const STEPS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * A single-select row of `expButton`s (Compose `ButtonGroup`, small). Keyboard and ARIA follow the WAI-ARIA radio
 * group: one tab stop, arrow keys move and select. Needs the `button-group` Sass mixin once in the app's styles.
 */
@Component({
  selector: 'exp-button-group',
  template: '<ng-content />',
  host: {
    class: 'exp-button-group',
    role: 'radiogroup',
    '[class.exp-button-group-connected]': 'connected()',
    '(keydown)': 'onKeydown($event)',
    '(pointerdown)': 'onPointerdown($event)',
  },
  providers: [{ provide: EXP_BUTTON_GROUP, useExisting: ExpButtonGroup }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpButtonGroup implements ExpButtonGroupRef {
  /** The selected button's `value`; a click on the selected button keeps it. */
  public readonly value: ModelSignal<unknown> = model<unknown>(null);
  /** Buttons touch and share their inner corners instead of growing when pressed. */
  public readonly connected: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
  });

  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly dir: Directionality = inject(Directionality);
  private readonly buttons: Signal<readonly ExpButton[]> = contentChildren(ExpButton, { descendants: true });
  private readonly tabStop: Signal<ExpButton | undefined> = computed(
    () => this.buttons().find((button) => button.value() === this.value()) ?? this.buttons()[0]
  );
  private pressAnimating: boolean = false;

  public select(value: unknown): void {
    this.value.set(value);
  }

  public isTabStop(button: ExpButton): boolean {
    return this.tabStop() === button;
  }

  protected onKeydown(event: KeyboardEvent): void {
    const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    const step = (STEPS[event.key] ?? 0) * (horizontal && this.dir.value === 'rtl' ? -1 : 1);
    const buttons = this.buttons();
    const current = buttons.findIndex((button) => button.host.contains(event.target as Node));
    if (step === 0 || current < 0) return;
    event.preventDefault();
    for (let offset = 1; offset < buttons.length; offset++) {
      const next = buttons[(current + step * offset + buttons.length) % buttons.length];
      if (!next.host.disabled) {
        next.host.focus();
        this.select(next.value());
        return;
      }
    }
  }

  protected onPointerdown(event: PointerEvent): void {
    const buttons = this.buttons().map((button) => button.host);
    const index = buttons.findIndex((button) => button.contains(event.target as Node));
    if (this.connected() || this.pressAnimating || index < 0 || buttons[index].disabled || reducedMotion()) return;
    this.pressAnimating = true;

    const style = getComputedStyle(this.host);
    const timing: KeyframeAnimationOptions = {
      duration: parseFloat(style.getPropertyValue('--exp-motion-fast-spatial-duration')),
      easing: style.getPropertyValue('--exp-motion-fast-spatial'),
      fill: 'forwards',
    };
    const widths = buttons.map((button) => button.getBoundingClientRect().width);
    const pressed = pressedWidths(widths, index, EXPANDED_RATIO);
    const grow = buttons.map((button, i) => {
      button.style.flex = 'none';
      return button.animate([{ width: `${widths[i]}px` }, { width: `${pressed[i]}px` }], timing);
    });

    const release = (): void => {
      document.removeEventListener('pointerup', release);
      document.removeEventListener('pointercancel', release);
      // Compose lets the press grow at least three quarters of the way before it shrinks back.
      const shrinkWhenGrown = (): void => {
        if ((grow[index].effect?.getComputedTiming().progress ?? 1) < 0.75) {
          requestAnimationFrame(shrinkWhenGrown);
          return;
        }
        const shrink = buttons.map((button, i) => {
          const current = button.getBoundingClientRect().width;
          grow[i].cancel();
          return button.animate([{ width: `${current}px` }, { width: `${widths[i]}px` }], timing);
        });
        void Promise.all(shrink.map((animation) => animation.finished)).finally(() => {
          buttons.forEach((button, i) => {
            shrink[i].cancel();
            button.style.flex = '';
          });
          this.pressAnimating = false;
        });
      };
      shrinkWhenGrown();
    };
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
  }
}

function reducedMotion(): boolean {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
