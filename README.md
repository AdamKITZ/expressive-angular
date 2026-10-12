# expressive-angular

Material 3 Expressive components for Angular, built on Angular Material's M3 tokens and the CDK.
[Jetpack Compose Material3](https://developer.android.com/jetpack/androidx/releases/compose-material3) is the
reference for sizes, shapes, motion and behaviour.

Status: not released yet. The first release covers button, icon button, button group and loading indicator.

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

Bump `projects/expressive-angular/package.json`, merge, then publish a GitHub release tagged `v<version>`. The
release workflow builds the library and publishes it to npm as `@adam01230/expressive-angular`.

## License

MIT. Values taken from Jetpack Compose (Apache 2.0) get credited in a `NOTICE` file.
