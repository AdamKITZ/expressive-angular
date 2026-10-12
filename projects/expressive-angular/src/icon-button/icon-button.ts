import { Directive, input, InputSignal } from '@angular/core';

export type ExpIconButtonAppearance = 'standard' | 'tonal';

/**
 * Turns an Angular Material icon button into an M3 Expressive one (Compose `IconButton` / `IconToggleButton`, small).
 * Needs the `icon-button` Sass mixin once in the app's styles.
 */
@Directive({
  selector: 'button[mat-icon-button][expIconButton]',
  host: {
    class: 'exp-icon-button',
    '[class.exp-icon-button-tonal]': "appearance() === 'tonal'",
    '[class.exp-icon-button-selected]': 'selected() === true',
    '[attr.aria-pressed]': 'selected() ?? null',
  },
})
export class ExpIconButton {
  public readonly appearance: InputSignal<ExpIconButtonAppearance> = input<ExpIconButtonAppearance>('standard');
  /** Makes it a toggle button; leave unset for a plain action. */
  public readonly selected: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);
}
