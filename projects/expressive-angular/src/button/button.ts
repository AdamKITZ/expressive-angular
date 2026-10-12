import { Directive, input, InputSignal } from '@angular/core';

/**
 * Turns an Angular Material tonal button into an M3 Expressive one (Compose `TonalToggleButton`, small).
 * Needs the `button` Sass mixin once in the app's styles.
 */
@Directive({
  selector: 'button[matButton="tonal"][expButton]',
  host: {
    class: 'exp-button',
    '[class.exp-button-selected]': 'selected() === true',
    '[attr.aria-pressed]': 'selected() ?? null',
  },
})
export class ExpButton {
  /** Makes it a toggle button; leave unset for a plain action. */
  public readonly selected: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);
}
