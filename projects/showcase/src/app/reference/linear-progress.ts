import { ExpLinearProgress } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `LinearProgressTest.states` in reference/compose: flat and wavy at 50 %, wavy at 5 %
 * (still flat) and 100 %, and both indeterminate ones in their first frame, where only the track shows.
 */
@Component({
  selector: 'app-linear-progress-reference',
  imports: [ExpLinearProgress],
  template: `
    <div class="scene" data-reference>
      <exp-linear-progress [value]="50" />
      <exp-linear-progress wavy [value]="50" />
      <exp-linear-progress wavy [value]="5" />
      <exp-linear-progress wavy [value]="100" />
      <exp-linear-progress />
      <exp-linear-progress wavy />
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
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      background: var(--mat-sys-surface);
    }

    exp-linear-progress {
      width: 240px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinearProgressReference {}
