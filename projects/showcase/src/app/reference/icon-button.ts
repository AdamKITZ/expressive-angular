import { ExpIconButton } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';

/** Must render the same scene as `IconButtonTest.states` in reference/compose. */
@Component({
  selector: 'app-icon-button-reference',
  imports: [MatIconButton, ExpIconButton],
  template: `
    <div class="scene" data-reference>
      <button mat-icon-button expIconButton><span class="dot"></span></button>
      <button mat-icon-button expIconButton [selected]="true"><span class="dot"></span></button>
      <button mat-icon-button expIconButton appearance="tonal"><span class="dot"></span></button>
      <button mat-icon-button expIconButton appearance="tonal" [selected]="true"><span class="dot"></span></button>
      <button mat-icon-button expIconButton disabled><span class="dot"></span></button>
      <button mat-icon-button expIconButton appearance="tonal" disabled><span class="dot"></span></button>
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
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonReference {}
