import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Must render the same scene as `NavigationBarTest.bar` in reference/compose. */
@Component({
  selector: 'app-navigation-bar-reference',
  template: `
    <nav class="exp-navigation-bar scene" data-reference>
      @for (index of [0, 1, 2, 3]; track index) {
        <a href="#" [attr.aria-current]="index === 1 ? 'page' : null">
          <span class="dot"></span>
          <span class="label"></span>
        </a>
      }
    </nav>
  `,
  styles: `
    @use '../../reference/compose-light-scheme' as compose;

    .scene {
      @include compose.compose-light-scheme;
      position: fixed;
      top: 0;
      left: 0;
      width: 360px;
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
export class NavigationBarReference {}
