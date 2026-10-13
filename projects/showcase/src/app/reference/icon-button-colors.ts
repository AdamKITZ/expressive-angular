import { ExpIconButton, ExpIconButtonAppearance } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';

/** Must render the same scene as `IconButtonTest.colors` in reference/compose. */
@Component({
  selector: 'app-icon-button-colors-reference',
  imports: [MatIconButton, ExpIconButton],
  template: `
    <div class="scene" data-reference>
      @for (appearance of appearances; track appearance) {
        <div class="row">
          <button mat-icon-button expIconButton [appearance]="appearance"><span class="dot"></span></button>
          <button mat-icon-button expIconButton [appearance]="appearance" [selected]="false">
            <span class="dot"></span>
          </button>
          <button mat-icon-button expIconButton [appearance]="appearance" [selected]="true">
            <span class="dot"></span>
          </button>
          <button mat-icon-button expIconButton [appearance]="appearance" [selected]="true" [morph]="false">
            <span class="dot"></span>
          </button>
          <button mat-icon-button expIconButton [appearance]="appearance" disabled><span class="dot"></span></button>
          <button mat-icon-button expIconButton [appearance]="appearance" [selected]="true" disabled>
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
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonColorsReference {
  protected readonly appearances: ExpIconButtonAppearance[] = ['filled', 'tonal', 'outlined', 'standard'];
}
