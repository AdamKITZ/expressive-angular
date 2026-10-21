import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `SearchBarTest.bar` in reference/compose: a 360dp collapsed search bar with a dot as
 * its leading icon and no text, so the scene doesn't depend on fonts. The markup is the bar `exp-search` renders.
 */
@Component({
  selector: 'app-search-reference',
  template: `
    <div class="scene" data-reference>
      <button type="button" class="exp-search-bar">
        <span class="exp-search-icon dot"></span>
      </button>
    </div>
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchReference {}
