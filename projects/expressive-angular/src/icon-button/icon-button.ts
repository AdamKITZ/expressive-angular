import {
  booleanAttribute,
  computed,
  Directive,
  input,
  InputSignal,
  InputSignalWithTransform,
  Signal,
} from '@angular/core';

export type ExpIconButtonAppearance = 'standard' | 'filled' | 'tonal' | 'outlined';
export type ExpIconButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type ExpIconButtonWidth = 'narrow' | 'uniform' | 'wide';
export type ExpIconButtonShape = 'round' | 'square';

/**
 * Turns an Angular Material icon button into an M3 Expressive one (Compose `IconButton` / `IconToggleButton` and
 * their filled, tonal and outlined variants). Needs the `icon-button` Sass mixin once in the app's styles.
 */
@Directive({
  selector: 'button[mat-icon-button][expIconButton]',
  host: {
    '[class]': 'classes()',
    '[class.exp-icon-button-toggle]': 'selected() !== undefined',
    '[class.exp-icon-button-selected]': 'selected() === true',
    '[class.exp-icon-button-static]': '!morph()',
    '[attr.aria-pressed]': 'selected() ?? null',
  },
})
export class ExpIconButton {
  public readonly appearance: InputSignal<ExpIconButtonAppearance> = input<ExpIconButtonAppearance>('standard');
  /** Makes it a toggle button; leave unset for a plain action. */
  public readonly selected: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);
  public readonly size: InputSignal<ExpIconButtonSize> = input<ExpIconButtonSize>('s');
  public readonly width: InputSignal<ExpIconButtonWidth> = input<ExpIconButtonWidth>('uniform');
  /** The resting shape; a selected toggle takes the other one. */
  public readonly shape: InputSignal<ExpIconButtonShape> = input<ExpIconButtonShape>('round');
  /** `false` keeps the resting shape when pressed or selected, so only the colour shows the state. */
  public readonly morph: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });

  protected readonly classes: Signal<string> = computed(() =>
    [
      'exp-icon-button',
      `exp-icon-button-${this.appearance()}`,
      `exp-icon-button-${this.size()}`,
      `exp-icon-button-${this.width()}`,
      `exp-icon-button-${this.shape()}`,
    ].join(' ')
  );
}
