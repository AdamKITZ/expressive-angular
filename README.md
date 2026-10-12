# expressive-angular

Material 3 Expressive components for Angular, built on Angular Material's M3 tokens and the CDK.
[Jetpack Compose Material3](https://developer.android.com/jetpack/androidx/releases/compose-material3) is the
reference for sizes, shapes, motion and behaviour.

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
}
```

The buttons are directives on Angular Material's, so focus, ripple and touch target stay Material's:

```html
<button mat-icon-button expIconButton aria-label="History" [selected]="open()"><mat-icon>history</mat-icon></button>
<button mat-icon-button expIconButton appearance="tonal" aria-label="Send"><mat-icon>send</mat-icon></button>

<exp-button-group aria-label="Billing" connected [(value)]="interval">
  <button matButton="tonal" expButton value="month">Monthly</button>
  <button matButton="tonal" expButton value="year">Yearly</button>
</exp-button-group>

<exp-loading-indicator aria-label="Loading" />
```

Import `ExpIconButton`, `ExpButton`, `ExpButtonGroup` and `ExpLoadingIndicator` from `@adam01230/expressive-angular`.
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
