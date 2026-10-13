import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

import { ExpToolbarFocus } from '../toolbar/toolbar-focus';

export type ExpDockedToolbarArrangement = 'space-between' | 'fixed';

/**
 * A full-width toolbar docked to the bottom of the screen (Compose `FlexibleBottomAppBar`). `space-between` spreads
 * the items across the bar, `fixed` centres them 32px apart. Pads itself by the bottom and side safe-area insets.
 * Keyboard follows the WAI-ARIA toolbar pattern, as in `exp-floating-toolbar`. Needs the `docked-toolbar` Sass mixin
 * once in the app's styles.
 */
@Component({
  selector: 'exp-docked-toolbar',
  imports: [ExpToolbarFocus],
  template: `
    <div
      class="exp-docked-toolbar-bar"
      role="toolbar"
      aria-orientation="horizontal"
      [attr.aria-label]="ariaLabel()"
      expToolbarFocus="horizontal"
    >
      <ng-content />
    </div>
  `,
  host: {
    '[class]': "'exp-docked-toolbar exp-docked-toolbar-' + arrangement()",
    '[attr.aria-label]': 'null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpDockedToolbar {
  public readonly arrangement: InputSignal<ExpDockedToolbarArrangement> =
    input<ExpDockedToolbarArrangement>('space-between');
  public readonly ariaLabel: InputSignal<string | undefined> = input<string | undefined>(undefined, {
    alias: 'aria-label',
  });
}
