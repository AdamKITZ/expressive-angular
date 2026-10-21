import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `NavigationRailTest.rails` in reference/compose. The label fade that runs when a
 * rail is toggled is switched off, because it also runs on the first render, which Compose doesn't animate.
 */
@Component({
  selector: 'app-navigation-rail-reference',
  template: `
    <div class="scene" data-reference>
      @for (expanded of [false, true]; track expanded) {
        <nav class="exp-navigation-rail" [class.exp-navigation-rail-expanded]="expanded">
          @for (index of [0, 1, 2]; track index) {
            <a href="#" [attr.aria-current]="index === 1 ? 'page' : null">
              <span class="dot"></span>
              <span class="label"></span>
            </a>
          }
        </nav>
      }
    </div>
  `,
  styles: `
    @use '../../reference/compose-light-scheme' as compose;

    .scene {
      @include compose.compose-light-scheme;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      height: 260px;
    }

    .scene .exp-navigation-rail > a {
      animation: none;
    }

    .dot {
      border-radius: 50%;
      background: currentColor;
    }

    .label {
      width: 40px;
      height: 16px;
      background: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationRailReference {}
