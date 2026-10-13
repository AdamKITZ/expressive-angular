import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

export type ExpSplitButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl';

/**
 * A leading action and a trailing menu button side by side (Compose `SplitButtonLayout`). Takes two Angular Material
 * buttons of the same `matButton` appearance; the trailing one turns into a pill and flips its icon while its
 * `aria-expanded` is true, as a `matMenuTriggerFor` sets it. Needs the `split-button` Sass mixin once in the app's
 * styles.
 */
@Component({
  selector: 'exp-split-button',
  template: '<ng-content />',
  host: {
    '[class]': "'exp-split-button exp-split-button-' + size()",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpSplitButton {
  public readonly size: InputSignal<ExpSplitButtonSize> = input<ExpSplitButtonSize>('s');
}
