import { ExpLoadingIndicator } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `LoadingIndicatorTest.firstFrame` in reference/compose, uncontained and contained. Deliberate difference: each
 * shape is centred on its centre of area, not on its bounds as in Compose, so the pentagon doesn't wobble; in this
 * first frame that moves the shape by less than 0.1px.
 */
@Component({
  selector: 'app-loading-indicator-reference',
  imports: [ExpLoadingIndicator],
  template: `
    <div class="scene" data-reference>
      <exp-loading-indicator aria-label="Loading" />
      <exp-loading-indicator contained aria-label="Loading" />
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
      gap: 12px;
      padding: 12px;
      background: var(--mat-sys-surface);
    }

    exp-loading-indicator {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingIndicatorReference {}
