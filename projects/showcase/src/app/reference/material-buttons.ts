import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';

/** Must render the same scene as `MaterialButtonsTest.variants` in reference/compose. */
@Component({
  selector: 'app-material-buttons-reference',
  imports: [MatButton, MatIconButton],
  template: `
    <div class="scene" data-reference>
      <button matButton="filled"><span class="dot"></span></button>
      <button matButton="elevated"><span class="dot"></span></button>
      <button matButton="tonal"><span class="dot"></span></button>
      <button matButton="outlined"><span class="dot"></span></button>
      <button matButton><span class="dot"></span></button>
      <button matButton="filled" disabled><span class="dot"></span></button>
      <button matIconButton aria-label="Dot"><span class="dot icon"></span></button>
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

    .icon {
      width: 24px;
      height: 24px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialButtonsReference {}
