import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  input,
  InputSignal,
  InputSignalWithTransform,
  Signal,
} from '@angular/core';

import { ExpToolbarFocus } from '../toolbar/toolbar-focus';

export type ExpFloatingToolbarOrientation = 'horizontal' | 'vertical';

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
  imports: [ExpToolbarFocus],
  template: `
    <div class="exp-floating-toolbar-fold" [attr.inert]="withFab() && !expanded() ? '' : null">
      <div class="exp-floating-toolbar-clip">
        <div
          class="exp-floating-toolbar-bar"
          role="toolbar"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-orientation]="orientation()"
          [expToolbarFocus]="orientation()"
        >
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
    '[attr.aria-label]': 'null',
    '[class.exp-floating-toolbar-vibrant]': 'vibrant()',
    '[class.exp-floating-toolbar-collapsed]': '!expanded()',
    '[class.exp-floating-toolbar-with-fab]': 'withFab()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpFloatingToolbar {
  public readonly orientation: InputSignal<ExpFloatingToolbarOrientation> =
    input<ExpFloatingToolbarOrientation>('horizontal');
  /** PrimaryContainer instead of SurfaceContainer, for a toolbar that should stand out. */
  public readonly vibrant: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  public readonly expanded: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Names the toolbar; the FAB beside it is not part of it. */
  public readonly ariaLabel: InputSignal<string | undefined> = input<string | undefined>(undefined, {
    alias: 'aria-label',
  });

  protected readonly withFab: Signal<boolean> = computed(() => this.fab() !== undefined);

  private readonly fab: Signal<ExpToolbarFab | undefined> = contentChild(ExpToolbarFab);
}
