import { ExpIconButton, ExpIconButtonSize } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';

/** Must render the same scene as `IconButtonTest.sizes` in reference/compose. */
@Component({
  selector: 'app-icon-button-sizes-reference',
  imports: [MatIconButton, ExpIconButton],
  template: `
    <div class="scene" data-reference>
      @for (size of sizes; track size) {
        <div class="row">
          <button mat-icon-button expIconButton appearance="tonal" [size]="size" width="narrow">
            <span class="dot"></span>
          </button>
          <button mat-icon-button expIconButton appearance="tonal" [size]="size"><span class="dot"></span></button>
          <button mat-icon-button expIconButton appearance="tonal" [size]="size" width="wide">
            <span class="dot"></span>
          </button>
          <button mat-icon-button expIconButton appearance="tonal" [size]="size" shape="square">
            <span class="dot"></span>
          </button>
          <button mat-icon-button expIconButton appearance="tonal" [size]="size" [selected]="true">
            <span class="dot"></span>
          </button>
          <button mat-icon-button expIconButton appearance="tonal" [size]="size" shape="square" [selected]="true">
            <span class="dot"></span>
          </button>
        </div>
      }
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
      gap: 8px;
      padding: 12px;
      background: var(--mat-sys-surface);
    }

    .row {
      display: flex;
      gap: 8px;
    }

    .dot {
      display: block;
      width: var(--exp-icon-button-icon-size);
      height: var(--exp-icon-button-icon-size);
      border-radius: 50%;
      background: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonSizesReference {
  protected readonly sizes: ExpIconButtonSize[] = ['xs', 's', 'm', 'l', 'xl'];
}
