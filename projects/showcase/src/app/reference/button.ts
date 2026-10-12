import { ExpButton } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

/** Must render the same scene as `ButtonTest.states` in reference/compose. */
@Component({
  selector: 'app-button-reference',
  imports: [MatButton, ExpButton],
  template: `
    <div class="scene" data-reference>
      <button matButton="tonal" expButton [selected]="false"><span class="dot"></span></button>
      <button matButton="tonal" expButton [selected]="true"><span class="dot"></span></button>
      <button matButton="tonal" expButton [selected]="false" disabled><span class="dot"></span></button>
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
      gap: 8px;
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
export class ButtonReference {}
