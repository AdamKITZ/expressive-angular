import { Directionality } from '@angular/cdk/bidi';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  ElementRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  Signal,
  viewChild,
} from '@angular/core';

export type ExpFloatingToolbarOrientation = 'horizontal' | 'vertical';

const FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex]';

/** Marks the `mat-fab` that sits next to an `exp-floating-toolbar`. */
@Directive({ selector: '[expToolbarFab]' })
export class ExpToolbarFab {}

/**
 * A pill-shaped toolbar that floats over content (Compose `HorizontalFloatingToolbar` / `VerticalFloatingToolbar`).
 * Items marked `expToolbarLeading` or `expToolbarTrailing` fold away while `expanded` is false. A `mat-fab` marked
 * `expToolbarFab` turns it into the FAB variant: the whole bar folds into the FAB, which grows from 56 to 80px.
 * Keyboard follows the WAI-ARIA toolbar pattern: one tab stop, arrow keys, Home and End move between items. Needs the
 * `floating-toolbar` Sass mixin once in the app's styles.
 */
@Component({
  selector: 'exp-floating-toolbar',
  template: `
    <div class="exp-floating-toolbar-fold" [attr.inert]="withFab() && !expanded() ? '' : null">
      <div class="exp-floating-toolbar-clip">
        <div #bar class="exp-floating-toolbar-bar" role="toolbar" [attr.aria-orientation]="orientation()">
          <div class="exp-floating-toolbar-side exp-floating-toolbar-leading" [attr.inert]="expanded() ? null : ''">
            <div><ng-content select="[expToolbarLeading]" /></div>
          </div>
          <ng-content />
          <div class="exp-floating-toolbar-side exp-floating-toolbar-trailing" [attr.inert]="expanded() ? null : ''">
            <div><ng-content select="[expToolbarTrailing]" /></div>
          </div>
        </div>
      </div>
    </div>
    <ng-content select="[expToolbarFab]" />
  `,
  host: {
    '[class]': "'exp-floating-toolbar exp-floating-toolbar-' + orientation()",
    '[class.exp-floating-toolbar-vibrant]': 'vibrant()',
    '[class.exp-floating-toolbar-collapsed]': '!expanded()',
    '[class.exp-floating-toolbar-with-fab]': 'withFab()',
    '(keydown)': 'onKeydown($event)',
    '(focusin)': 'onFocusin($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpFloatingToolbar {
  public readonly orientation: InputSignal<ExpFloatingToolbarOrientation> =
    input<ExpFloatingToolbarOrientation>('horizontal');
  /** PrimaryContainer instead of SurfaceContainer, for a toolbar that should stand out. */
  public readonly vibrant: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly expanded: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });

  protected readonly withFab: Signal<boolean> = computed(() => this.fab() !== undefined);

  private readonly fab: Signal<ExpToolbarFab | undefined> = contentChild(ExpToolbarFab);
  private readonly bar: Signal<ElementRef<HTMLElement>> = viewChild.required<ElementRef<HTMLElement>>('bar');
  private readonly dir: Directionality = inject(Directionality);

  constructor() {
    afterRenderEffect(() => {
      this.expanded();
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
    return [...this.bar().nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (item) => !item.closest('[inert]') && !item.matches(':disabled')
    );
  }

  private setTabStop(stop: HTMLElement | undefined): void {
    for (const item of this.items()) item.tabIndex = item === stop ? 0 : -1;
  }
}
