# CLAUDE.md

expressive-angular: Material 3 Expressive components for Angular 22 (standalone, zoneless, signals), published to
npm as `@adam01230/expressive-angular`. Built on Angular Material's `--mat-sys-*` tokens and the CDK. Jetpack
Compose Material3 (androidx) is the reference for every value and behaviour.

## Commands

```bash
npm start              # showcase app
npm run build          # library, then showcase
npm run test:ci        # Vitest, single run (`npm test` is watch mode)
npm run lint           # ESLint; `npm run lint:fix` to fix
npm run format:check   # Prettier; CI runs it
```

Before calling anything done: lint, format:check, test:ci and build are green.

## How we work

Adam reviews every change and must understand it in one sitting.

- **Pseudocode first** for anything beyond a small fix; show it to Adam before writing code.
- **Then TDD**: behaviours become a short list of tests, watch them fail, write the minimum code.
- **Lean tests**: behaviour a consumer relies on; never framework wiring, template structure or CSS.
- **Small and focused**: one component or one concern per PR. No options or generics "for later".
- **Comments**: the default is none. Only what the code cannot say (a spec constraint, why the obvious way is wrong).

## Rules

- **Compose is the reference.** Sizes, shapes, colour roles and motion come from the androidx Material3 token files
  of a pinned version, never from memory or screenshots. Anything taken from androidx is credited in `NOTICE`.
- **Only what a consumer needs.** A component or size lands when an app uses it, not to complete the catalogue.
- **No animation libraries.** CSS and the Web Animations API only. Honour `prefers-reduced-motion`.
- **Theming through Angular Material.** Components read `--mat-sys-*` tokens; no hardcoded colours.
- **Accessibility:** keyboard and ARIA follow the WAI-ARIA Authoring Practices, since Compose says nothing about the web.
- Selector prefix `exp`. DI with `inject()`. OnPush everywhere.
- Commits follow commitlint: `<type>(<scope>): <description>`, scope required (component name, `ci`, `showcase`, `*`).

## Where things are

```
projects/expressive-angular/   the library (ng-packagr)
projects/showcase/             demo app, one route per component; later the screenshot harness
```
