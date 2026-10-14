import { ExpSlider } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `SliderTest.states` in reference/compose: continuous at 0.3, three steps at 0.5 and
 * 0.25, the ends, and two disabled ones.
 */
@Component({
  selector: 'app-slider-reference',
  imports: [ExpSlider],
  template: `
    <div class="scene" data-reference>
      <exp-slider><input type="range" aria-label="Continuous" min="0" max="1" value="0.3" /></exp-slider>
      <exp-slider><input type="range" aria-label="Steps" min="0" max="1" step="0.25" value="0.5" /></exp-slider>
      <exp-slider><input type="range" aria-label="Steps" min="0" max="1" step="0.25" value="0.25" /></exp-slider>
      <exp-slider><input type="range" aria-label="Start" min="0" max="1" value="0" /></exp-slider>
      <exp-slider><input type="range" aria-label="End" min="0" max="1" value="1" /></exp-slider>
      <exp-slider><input type="range" aria-label="Disabled" min="0" max="1" value="0.6" disabled /></exp-slider>
      <exp-slider>
        <input type="range" aria-label="Disabled steps" min="0" max="1" step="0.25" value="0.75" disabled />
      </exp-slider>
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
export class SliderReference {}
