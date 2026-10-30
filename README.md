# expressive-angular

Material 3 Expressive components for Angular, built on Angular Material's M3 tokens and the CDK.
[Jetpack Compose Material3](https://developer.android.com/jetpack/androidx/releases/compose-material3) is the
reference for sizes, shapes, motion and behaviour.

Try the components in the [playground](https://adamkitz.github.io/expressive-angular/).

## Usage

```bash
npm install @adam01230/expressive-angular
```

Include the styles once, next to your Angular Material theme:

```scss
@use '@adam01230/expressive-angular' as exp;

html {
  @include exp.tokens; // --exp-motion-* springs as linear() easings with durations, --exp-corner-* sizes
  @include exp.material-buttons; // every Angular Material button and icon button gets Compose's shapes and padding
  @include exp.icon-button;
  @include exp.button;
  @include exp.button-group;
  @include exp.split-button;
  @include exp.floating-toolbar;
  @include exp.docked-toolbar;
  @include exp.segmented-list; // children of .exp-segmented-list become Compose's segmented list items
  @include exp.card; // .exp-card, .exp-card-elevated, .exp-card-outlined
  @include exp.menu; // every mat-menu gets Compose's Expressive menu shapes
  @include exp.navigation-bar; // a and button children of .exp-navigation-bar become Compose's navigation bar items
  @include exp.navigation-rail; // the same for .exp-navigation-rail, collapsed or .exp-navigation-rail-expanded
  @include exp.search; // exp-search
  @include exp.bottom-sheet; // exp-bottom-sheet
  @include exp.side-sheet; // .exp-side-sheet, exp-modal-side-sheet
}
```

The buttons are directives on Angular Material's, so focus, ripple and touch target stay Material's:

```html
<button mat-icon-button expIconButton aria-label="History" [selected]="open()"><mat-icon>history</mat-icon></button>
<button mat-icon-button expIconButton appearance="tonal" aria-label="Send"><mat-icon>send</mat-icon></button>
<button mat-icon-button expIconButton appearance="filled" size="l" width="wide" shape="square" aria-label="Play">
  <mat-icon>play_arrow</mat-icon>
</button>

<exp-button-group aria-label="Billing" connected [(value)]="interval">
  <button matButton="tonal" expButton value="month">Monthly</button>
  <button matButton="tonal" expButton value="year">Yearly</button>
</exp-button-group>

<exp-split-button size="m">
  <button matButton="filled"><mat-icon>edit</mat-icon> Edit</button>
  <button matButton="filled" aria-label="More" [matMenuTriggerFor]="menu">
    <mat-icon>keyboard_arrow_down</mat-icon>
  </button>
</exp-split-button>

<exp-floating-toolbar aria-label="Formatting" vibrant [expanded]="editing()">
  <button mat-icon-button expIconButton expToolbarLeading aria-label="Undo"><mat-icon>undo</mat-icon></button>
  <button mat-icon-button expIconButton [morph]="false" aria-label="Bold" [selected]="bold()" (click)="toggleBold()">
    <mat-icon>format_bold</mat-icon>
  </button>
  <button matFab expToolbarFab aria-label="Done"><mat-icon>check</mat-icon></button>
</exp-floating-toolbar>

<exp-docked-toolbar aria-label="Message">
  <button mat-icon-button expIconButton aria-label="Archive"><mat-icon>archive</mat-icon></button>
  <button mat-icon-button expIconButton aria-label="Delete"><mat-icon>delete</mat-icon></button>
</exp-docked-toolbar>

<mat-menu #view="matMenu">
  <exp-menu-group label="Sort by">
    <button mat-menu-item role="menuitemradio" aria-checked="true" class="exp-menu-item-selected">Date</button>
    <button mat-menu-item role="menuitemradio" aria-checked="false">Name</button>
  </exp-menu-group>
  <exp-menu-group>
    <button mat-menu-item>
      <mat-icon>refresh</mat-icon><span>Refresh</span><span class="exp-menu-item-trailing">⌘R</span>
    </button>
  </exp-menu-group>
</mat-menu>

<exp-loading-indicator aria-label="Loading" />
<exp-loading-indicator contained aria-label="Saving" />

<exp-linear-progress wavy [value]="uploaded" aria-label="Upload" />
<exp-circular-progress wavy aria-label="Loading" />

<exp-slider><input type="range" aria-label="Volume" min="0" max="1" formControlName="volume" /></exp-slider>
<exp-slider vertical reverse><input type="range" aria-label="Level" formControlName="level" /></exp-slider>
<exp-range-slider>
  <input type="range" aria-label="From" min="0" max="100" formControlName="from" />
  <input type="range" aria-label="To" min="0" max="100" formControlName="to" />
</exp-range-slider>

<nav class="exp-navigation-bar">
  <a routerLink="/" routerLinkActive ariaCurrentWhenActive="page"><mat-icon>home</mat-icon><span>Home</span></a>
  <a routerLink="/saved" routerLinkActive ariaCurrentWhenActive="page"
    ><mat-icon>favorite</mat-icon><span>Saved</span></a
  >
</nav>

<div class="exp-segmented-list">
  <div>Notifications</div>
  <a href="/language">Language</a>
  <div>
    <a class="exp-segmented-list-action" href="/orders/2">Order 2</a>
    <button matButton="outlined">Received</button>
  </div>
</div>
```

Import `ExpIconButton`, `ExpButton`, `ExpButtonGroup`, `ExpSplitButton`, `ExpFloatingToolbar`, `ExpToolbarFab`, `ExpDockedToolbar`,
`ExpLoadingIndicator`, `ExpMenuGroup`, `ExpLinearProgress`, `ExpCircularProgress`, `ExpSlider` and `ExpRangeSlider` from `@adam01230/expressive-angular`.
An icon button's `appearance` is `standard`, `filled`, `tonal` or `outlined`; `size` runs from `xs` to `xl`, `width` is
`narrow`, `uniform` or `wide`, and `shape` is `round` or `square`. `[morph]="false"` keeps a toggle's shape when it is
pressed or selected. A split button takes two Material buttons of the same appearance (`filled`, `tonal`, `elevated` or `outlined`); the
trailing one becomes a pill and flips its icon while its menu is open. A floating toolbar is `horizontal` or `vertical`, standard or `vibrant`; while `expanded` is false its
`expToolbarLeading` and `expToolbarTrailing` items fold away, or, with an `expToolbarFab`, the whole bar folds into
the FAB. Icon buttons inside it take the toolbar's content colour; Compose's toolbars use toggles that keep their shape,
hence `[morph]="false"`. A docked toolbar spans the bottom of the screen and pads itself by the safe-area insets; its
`arrangement` is `space-between` or `fixed` (centred, 32px apart), and `--exp-docked-toolbar-container` and
`--exp-docked-toolbar-content` change its colours. A linear progress indicator takes a `value` from 0 to 100, or none while the wait is unknown; `wavy` turns its indicator into
the expressive wave. `contained` puts the loading indicator on a round PrimaryContainer, as Compose's `ContainedLoadingIndicator`.
A circular progress indicator works the same as the linear one and is 40px, or 48px when wavy; give it another `width` and `height`
to resize it. A slider draws Compose's `Slider` around a native `<input type="range">`, which keeps the value, forms
binding, label and keyboard; without a `step` attribute it is continuous, with one it snaps and shows a dot per step.
A `vertical` slider fills its height and runs from the top down, or from the bottom up with `reverse`.
A range slider takes two such inputs with the same `min`, `max` and `step`, the start first; a press moves the nearer
thumb, and neither passes the other.
With `exp.menu`, every `mat-menu` looks like Compose's Expressive menu: one rounded group with inset items. Put the
items into `exp-menu-group`s to split a menu into separate groups, each with an optional `label`. The class
`exp-menu-item-selected` marks the selected item; set `role` and `aria-checked` yourself. A trailing icon or shortcut
goes into a `.exp-menu-item-trailing` span after the label. `--exp-menu-container` changes the menu colour.
A button group also takes `[formControl]` or `formControlName` in place of `[(value)]`.
Every child of `.exp-segmented-list` becomes a segmented list item: 2px apart, small corners, large outer corners on the
first and last. Lay out the item's content yourself; the list sets its shape, padding, height and colours.
`--exp-segmented-list-container` changes the items' Surface colour, for a list that sits on a Surface page.
An item that is an `a[href]` or a `button` is clickable as a whole and takes Compose's hover, focus and pressed states.
When an item holds buttons of its own, keep it a `div` and give its main link or button the class
`exp-segmented-list-action`: its click area then covers the whole item, and the other buttons stay clickable on top.
With `exp.card`, `.exp-card`, `.exp-card-elevated` and `.exp-card-outlined` draw Compose's filled, elevated and
outlined card: the container, its corners and colours; lay out and pad the content yourself. A card that is an
`a[href]` or a `button` is clickable and takes Compose's hover, focus and pressed states and elevation. A card with
buttons of its own stays a `div` and gives its main link the class `exp-card-action`, as in a segmented list.
`--exp-card-container` changes the container colour.
With `exp.navigation-bar`, every `a` or `button` in a `.exp-navigation-bar` becomes a navigation bar item (Compose's
`ShortNavigationBar`): the first child is the icon, the rest the label. The item with `aria-current` is selected, so
`routerLinkActive` with `ariaCurrentWhenActive="page"` drives it. The bar pads itself by the bottom safe-area inset;
`--exp-navigation-bar-container` changes its colour.
`exp.navigation-rail` does the same for a `.exp-navigation-rail` (Compose's `WideNavigationRail`): 96px wide with the
label under the icon, or, with `.exp-navigation-rail-expanded`, as wide as its widest item (220px to 360px) with the
label beside the icon. A `.exp-navigation-rail-header` child, such as the button that toggles the class, sits above
the items, centred on their icons. The rail fills its parent's height; `--exp-navigation-rail-container` changes its colour.
`exp-modal-navigation-rail` takes the place of a navigation drawer (Compose's `ModalWideNavigationRail` with
`hideOnCollapse`): bind `[(open)]` and it slides an expanded rail in from the start edge over a scrim, as a modal
dialog that traps focus and closes on Escape or a click on the scrim. Put the same header and items into it as into a
`.exp-navigation-rail`, and close it yourself after a navigation. `--exp-modal-navigation-rail-container` changes its
colour.
`exp-search` is Compose's search bar: a pill that shows `[(query)]` or the `placeholder` and, when clicked, opens the
search as a modal dialog with the input field and the content you put inside `exp-search`, such as result links. By
default the field stays in place and the results drop down below it; `[fullScreen]="true"` fills the screen and adds a
back button, as on phones. `[(expanded)]` tells whether it is open, Enter emits `(searched)` with the query, and Escape,
the scrim and the back button close it. `--exp-search-container` changes its colour.
`exp-bottom-sheet` is Compose's modal bottom sheet: bind `[(open)]` and it slides up from the bottom edge over a scrim,
at most 640px wide, with a drag handle above the content you put inside it. A sheet taller than half the window opens
half way and opens fully on a drag or scroll up; a drag down, Escape, the scrim or the drag handle of a fully open sheet
close it. The handle strip can always be dragged, and the rest of the sheet while half open. Fully open, the content
scrolls natively, and pulling it down while it is scrolled to the top drags the sheet. `handleLabel` names the handle for screen readers, and `--exp-bottom-sheet-container` changes its
colour.
`exp-standard-bottom-sheet` is the sheet of Compose's `BottomSheetScaffold`: it sits at the bottom of its positioned
parent without a scrim, shows its top `peekHeight` pixels (56 by default) and opens fully on a drag up or a click on its
handle; `[(expanded)]` tells and sets that. Open, pulling its content down while it is scrolled to the top folds it. Leave room for the peek height under the parent's own content.
Compose has no side sheet, so `exp.side-sheet` takes its values from Material Components for Android.
`.exp-side-sheet` is the standard sheet: a 256px panel (`--exp-side-sheet-width` changes it for both) on Surface for you to place beside the content.
`exp-modal-side-sheet` slides in from the end edge over a scrim: bind `[(open)]`, lay out its header, content and
actions inside, and a swipe towards the edge, Escape or the scrim close it. `--exp-side-sheet-container` and
`--exp-modal-side-sheet-container` change their colours. `.exp-side-sheet-detached` and `[detached]="true"` inset the sheets by
16px with large corners all round. Inside, `.exp-side-sheet-header` (a back button first, then a
`.exp-side-sheet-headline`, then a close button last), the content and `.exp-side-sheet-actions` give the spec's
paddings.
The motion tokens work on their own too:

```css
.thing {
  transition: transform var(--exp-motion-fast-spatial-duration) var(--exp-motion-fast-spatial);
}
```

## Development

```bash
npm install
npm start            # showcase on http://localhost:4200
npm run build        # library to dist/expressive-angular, then the showcase
npm run test:ci      # unit tests, single run
npm run lint
npm run format:check
```

## Releasing

Bump `projects/expressive-angular/package.json`, merge, then run the `Release` workflow on `main` (Actions → Release →
Run workflow). It builds the library, publishes it to npm as `@adam01230/expressive-angular` and creates the GitHub
release `v<version>`. Publishing needs no token: npm trusts this repository's `release.yml` (npm package settings →
Trusted Publisher).

## License

MIT. Values taken from Jetpack Compose (Apache 2.0) are credited in `NOTICE`.
