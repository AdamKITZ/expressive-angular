import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  InputSignal,
  model,
  ModelSignal,
  Signal,
  viewChild,
} from '@angular/core';

/**
 * Compose's `ModalWideNavigationRail` with `hideOnCollapse`, the Expressive replacement for a navigation drawer: an
 * expanded navigation rail that slides in from the start edge over a scrim while `open` is true. Its content is that
 * of an `.exp-navigation-rail` (an optional `.exp-navigation-rail-header` and the items). It runs in a native modal
 * `<dialog>`, which traps focus and closes on Escape; a click on the scrim closes it too. Closing on navigation is up
 * to the app. Needs the `navigation-rail` Sass mixin once in the app's styles.
 */
@Component({
  selector: 'exp-modal-navigation-rail',
  template: `
    <dialog
      #dialog
      class="exp-modal-navigation-rail"
      [attr.aria-label]="label()"
      (close)="open.set(false)"
      (click)="$event.target === dialog && open.set(false)"
    >
      <nav class="exp-navigation-rail exp-navigation-rail-expanded">
        <ng-content />
      </nav>
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpModalNavigationRail {
  public readonly open: ModelSignal<boolean> = model(false);
  public readonly label: InputSignal<string | undefined> = input<string>();

  private readonly dialog: Signal<ElementRef<HTMLDialogElement>> = viewChild.required('dialog');

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) {
        dialog.showModal();
      } else if (!this.open() && dialog.open) {
        dialog.close();
      }
    });
  }
}
