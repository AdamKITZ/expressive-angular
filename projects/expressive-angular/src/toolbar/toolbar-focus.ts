import { Directionality } from '@angular/cdk/bidi';
import { afterEveryRender, Directive, ElementRef, inject, input, InputSignal } from '@angular/core';

const FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex]';

/**
 * Keyboard for a `role="toolbar"` element, per the WAI-ARIA toolbar pattern: one tab stop, arrow keys along the
 * orientation, Home and End. Items inside an `[inert]` subtree or disabled are skipped.
 */
@Directive({
  selector: '[expToolbarFocus]',
  host: {
    '(keydown)': 'onKeydown($event)',
    '(focusin)': 'onFocusin($event)',
  },
})
export class ExpToolbarFocus {
  public readonly orientation: InputSignal<'horizontal' | 'vertical'> = input.required({ alias: 'expToolbarFocus' });

  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly dir: Directionality = inject(Directionality);

  constructor() {
    afterEveryRender(() => {
      const items = this.items();
      this.setTabStop(items.find((item) => item.tabIndex === 0) ?? items[0]);
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    const items = this.items();
    const current = items.indexOf(event.target as HTMLElement);
    const next = current < 0 ? undefined : this.nextIndex(event.key, current, items.length);
    if (next === undefined) return;
    event.preventDefault();
    items[next].focus();
  }

  protected onFocusin(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    if (this.items().includes(target)) this.setTabStop(target);
  }

  private nextIndex(key: string, current: number, count: number): number | undefined {
    const vertical = this.orientation() === 'vertical';
    const rtl = !vertical && this.dir.value === 'rtl';
    const forward = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    if (key === forward) return (current + 1) % count;
    if (key === backward) return (current - 1 + count) % count;
    if (key === 'Home') return 0;
    if (key === 'End') return count - 1;
    return undefined;
  }

  private items(): HTMLElement[] {
    return [...this.host.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (item) => !item.closest('[inert]') && !item.matches(':disabled')
    );
  }

  private setTabStop(stop: HTMLElement | undefined): void {
    for (const item of this.items()) item.tabIndex = item === stop ? 0 : -1;
  }
}
