import { ExpCircularProgress } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `CircularProgressTest.states` in reference/compose: flat at 30 %, wavy at 30 %, 70 %
 * and 5 % (still a circle), and both indeterminate ones in their first frame.
 */
@Component({
  selector: 'app-circular-progress-reference',
  imports: [ExpCircularProgress],
  template: `
    <div class="scene" data-reference>
      <exp-circular-progress [value]="30" />
      <exp-circular-progress wavy [value]="30" />
      <exp-circular-progress wavy [value]="70" />
      <exp-circular-progress wavy [value]="5" />
      <exp-circular-progress />
      <exp-circular-progress wavy />
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircularProgressReference {}
