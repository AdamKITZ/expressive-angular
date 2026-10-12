import {
  ChangeDetectorRef,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';

/** What a button needs from the `exp-button-group` around it. */
export interface ExpButtonGroupRef {
  readonly value: Signal<unknown>;
  select(value: unknown): void;
  isTabStop(button: ExpButton): boolean;
}

export const EXP_BUTTON_GROUP: InjectionToken<ExpButtonGroupRef> = new InjectionToken<ExpButtonGroupRef>(
  'ExpButtonGroup'
);

/**
 * Turns an Angular Material tonal button into an M3 Expressive one (Compose `TonalToggleButton`, small).
 * Needs the `button` Sass mixin once in the app's styles. Inside an `exp-button-group` it becomes one of the group's
 * radios and `selected` is ignored.
 */
@Directive({
  selector: 'button[matButton="tonal"][expButton]',
  host: {
    class: 'exp-button',
    '[class.exp-button-selected]': 'checked()',
    '[attr.aria-pressed]': 'group ? null : (selected() ?? null)',
    '[attr.role]': "group ? 'radio' : null",
    '[attr.aria-checked]': 'group ? checked() : null',
    '(click)': 'group?.select(value())',
  },
})
export class ExpButton {
  /** Makes it a toggle button; leave unset for a plain action. */
  public readonly selected: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);
  /** What the surrounding `exp-button-group` holds while this button is selected. */
  public readonly value: InputSignal<unknown> = input<unknown>(undefined);
  public readonly host: HTMLButtonElement = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;

  protected readonly group: ExpButtonGroupRef | null = inject(EXP_BUTTON_GROUP, { optional: true });
  protected readonly checked: Signal<boolean> = computed(() =>
    this.group ? this.group.value() === this.value() : this.selected() === true
  );

  constructor() {
    const matButton = inject(MatButton);
    const changeDetector = inject(ChangeDetectorRef);
    const group = this.group;
    if (group) {
      // MatButton owns the tabindex attribute, so a second host binding would fight over it. Its tabIndex is a plain
      // field, hence the explicit check.
      effect(() => {
        matButton.tabIndex = group.isTabStop(this) ? 0 : -1;
        changeDetector.markForCheck();
      });
    }
  }
}
