import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
  viewChild,
} from '@angular/core';

/**
 * Compose's `SearchBar` with its expanded search: a 56px pill showing the query or the placeholder, which opens a
 * modal `<dialog>` with the input field and the projected results. Docked (the default) the field stays where the bar
 * is and the results drop down below it, 2px apart, over a scrim (`ExpandedDockedSearchBarWithGap`); `fullScreen`
 * fills the screen instead and shows a back button (`ExpandedFullScreenSearchBar`). Escape, a click on the scrim and
 * the back button collapse it; Enter emits `searched`. Lay out the results yourself. Needs the `search` Sass mixin once
 * in the app's styles.
 */
@Component({
  selector: 'exp-search',
  template: `
    <button
      #bar
      type="button"
      class="exp-search-bar"
      aria-haspopup="dialog"
      [attr.aria-expanded]="expanded()"
      (click)="expanded.set(true)"
    >
      <svg class="exp-search-icon" viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="searchIcon" /></svg>
      <span class="exp-search-text" [class.exp-search-placeholder]="!query()">{{ query() || placeholder() }}</span>
    </button>
    <dialog
      #dialog
      class="exp-search-view"
      [class.exp-search-view-full-screen]="fullScreen()"
      [attr.aria-label]="placeholder()"
      (close)="expanded.set(false)"
      (click)="$event.target === dialog && expanded.set(false)"
    >
      <div class="exp-search-bar exp-search-field">
        @if (fullScreen()) {
          <button type="button" class="exp-search-back" aria-label="Back" (click)="expanded.set(false)">
            <svg class="exp-search-icon" viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="backIcon" /></svg>
          </button>
        } @else {
          <svg class="exp-search-icon" viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="searchIcon" /></svg>
        }
        <input
          type="text"
          role="searchbox"
          autofocus
          enterkeyhint="search"
          autocomplete="off"
          [placeholder]="placeholder()"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
          (keydown.enter)="searched.emit(query())"
        />
      </div>
      <div class="exp-search-results">
        <ng-content />
      </div>
    </dialog>
  `,
  host: { class: 'exp-search' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpSearch {
  public readonly query: ModelSignal<string> = model('');
  public readonly expanded: ModelSignal<boolean> = model(false);
  public readonly placeholder: InputSignal<string> = input('');
  public readonly fullScreen: InputSignal<boolean> = input(false);
  public readonly searched: OutputEmitterRef<string> = output<string>();

  protected readonly searchIcon: string =
    'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z';
  protected readonly backIcon: string = 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z';

  private readonly bar: Signal<ElementRef<HTMLButtonElement>> = viewChild.required('bar');
  private readonly dialog: Signal<ElementRef<HTMLDialogElement>> = viewChild.required('dialog');

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.expanded() && !dialog.open) {
        const bar = this.bar().nativeElement.getBoundingClientRect();
        dialog.style.setProperty('--exp-search-bar-top', `${bar.top}px`);
        dialog.style.setProperty('--exp-search-bar-left', `${bar.left}px`);
        dialog.style.setProperty('--exp-search-bar-width', `${bar.width}px`);
        dialog.showModal();
      } else if (!this.expanded() && dialog.open) {
        dialog.close();
      }
    });
  }
}
