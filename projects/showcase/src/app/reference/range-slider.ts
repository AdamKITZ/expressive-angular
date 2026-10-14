import { ExpRangeSlider } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `SliderTest.ranges` in reference/compose: continuous, three steps, the whole range,
 * both thumbs on one spot, and disabled.
 */
@Component({
  selector: 'app-range-slider-reference',
  imports: [ExpRangeSlider],
  template: `
    <div class="scene" data-reference>
      <exp-range-slider>
        <input type="range" aria-label="From" min="0" max="1" value="0.2" />
        <input type="range" aria-label="To" min="0" max="1" value="0.7" />
      </exp-range-slider>
      <exp-range-slider>
        <input type="range" aria-label="From" min="0" max="1" step="0.25" value="0.25" />
        <input type="range" aria-label="To" min="0" max="1" step="0.25" value="0.75" />
      </exp-range-slider>
      <exp-range-slider>
        <input type="range" aria-label="From" min="0" max="1" step="0.25" value="0" />
        <input type="range" aria-label="To" min="0" max="1" step="0.25" value="1" />
      </exp-range-slider>
      <exp-range-slider>
        <input type="range" aria-label="From" min="0" max="1" value="0.5" />
        <input type="range" aria-label="To" min="0" max="1" value="0.5" />
      </exp-range-slider>
      <exp-range-slider>
        <input type="range" aria-label="From" min="0" max="1" value="0.3" disabled />
        <input type="range" aria-label="To" min="0" max="1" value="0.6" disabled />
      </exp-range-slider>
    </div>
  `,
  styles: `
    @use '../../reference/compose-light-scheme' as compose;

    .scene {
      @include compose.compose-light-scheme;
      position: fixed;
      top: 0;
      left: 0;
      width: 300px;
      padding: 12px;
      background: var(--mat-sys-surface);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeSliderReference {}
