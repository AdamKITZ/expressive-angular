import { ExpSlider } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `SliderTest.verticals` in reference/compose: continuous at 0.3, a short track at
 * 0.06, three steps at 0.5, the ends, reversed at 0.3 and a disabled one.
 */
@Component({
  selector: 'app-vertical-slider-reference',
  imports: [ExpSlider],
  template: `
    <div class="scene" data-reference>
      <exp-slider vertical><input type="range" aria-label="Continuous" min="0" max="1" value="0.3" /></exp-slider>
      <exp-slider vertical><input type="range" aria-label="Short" min="0" max="1" value="0.06" /></exp-slider>
      <exp-slider vertical>
        <input type="range" aria-label="Steps" min="0" max="1" step="0.25" value="0.5" />
      </exp-slider>
      <exp-slider vertical><input type="range" aria-label="Start" min="0" max="1" value="0" /></exp-slider>
      <exp-slider vertical><input type="range" aria-label="End" min="0" max="1" value="1" /></exp-slider>
      <exp-slider vertical reverse>
        <input type="range" aria-label="Reversed" min="0" max="1" value="0.3" />
      </exp-slider>
      <exp-slider vertical
        ><input type="range" aria-label="Disabled" min="0" max="1" value="0.6" disabled
      /></exp-slider>
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
      height: 200px;
      padding: 12px;
      background: var(--mat-sys-surface);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalSliderReference {}
