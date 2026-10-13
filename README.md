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
  @include exp.icon-button;
  @include exp.button;
  @include exp.button-group;
  @include exp.split-button;
  @include exp.floating-toolbar;
  @include exp.docked-toolbar;
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

<exp-loading-indicator aria-label="Loading" />
```

Import `ExpIconButton`, `ExpButton`, `ExpButtonGroup`, `ExpSplitButton`, `ExpFloatingToolbar`, `ExpToolbarFab`, `ExpDockedToolbar` and
`ExpLoadingIndicator` from `@adam01230/expressive-angular`.
An icon button's `appearance` is `standard`, `filled`, `tonal` or `outlined`; `size` runs from `xs` to `xl`, `width` is
`narrow`, `uniform` or `wide`, and `shape` is `round` or `square`. `[morph]="false"` keeps a toggle's shape when it is
pressed or selected. A split button takes two Material buttons of the same appearance (`filled`, `tonal`, `elevated` or `outlined`); the
trailing one becomes a pill and flips its icon while its menu is open. A floating toolbar is `horizontal` or `vertical`, standard or `vibrant`; while `expanded` is false its
`expToolbarLeading` and `expToolbarTrailing` items fold away, or, with an `expToolbarFab`, the whole bar folds into
the FAB. Icon buttons inside it take the toolbar's content colour; Compose's toolbars use toggles that keep their shape,
hence `[morph]="false"`. A docked toolbar spans the bottom of the screen and pads itself by the safe-area insets; its
`arrangement` is `space-between` or `fixed` (centred, 32px apart), and `--exp-docked-toolbar-container` and
`--exp-docked-toolbar-content` change its colours. A button group also takes `[formControl]` or `formControlName` in place of `[(value)]`.
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
release `v<version>`.

## License

MIT. Values taken from Jetpack Compose (Apache 2.0) are credited in `NOTICE`.
