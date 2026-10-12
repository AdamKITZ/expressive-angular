import { ExpButton, ExpButtonGroup } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

/** Must render the same scene as `ButtonGroupTest.states` in reference/compose. */
@Component({
  selector: 'app-button-group-reference',
  imports: [MatButton, ExpButton, ExpButtonGroup],
  template: `
    <div class="scene" data-reference>
      <exp-button-group aria-label="Standard" [value]="2">
        @for (value of [1, 2, 3]; track value) {
          <button matButton="tonal" expButton [value]="value"><span class="dot"></span></button>
        }
      </exp-button-group>
      <exp-button-group aria-label="Connected" connected [value]="2">
        @for (value of [1, 2, 3, 4]; track value) {
          <button matButton="tonal" expButton [value]="value"><span class="dot"></span></button>
        }
      </exp-button-group>
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
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      background: var(--mat-sys-surface);
    }

    .dot {
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupReference {}
