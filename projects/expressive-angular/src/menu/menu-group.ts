import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

/**
 * Compose's `DropdownMenuGroup` inside a `mat-menu`: puts the `mat-menu-item`s inside it into a container of their
 * own, with an optional label above them. A menu with two or more groups draws them as separate rounded containers
 * 2px apart; the styles are in the `menu` mixin.
 */
@Component({
  selector: 'exp-menu-group',
  template: `
    @if (label()) {
      <div class="exp-menu-group-label" aria-hidden="true">{{ label() }}</div>
    }
    <ng-content />
  `,
  host: {
    class: 'exp-menu-group',
    role: 'group',
    '[attr.aria-label]': 'label() || null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpMenuGroup {
  public readonly label: InputSignal<string | undefined> = input<string>();
}
