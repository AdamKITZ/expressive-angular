import { ExpStandardBottomSheet } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `StandardBottomSheetTest.sheet` in reference/compose: a 360 × 240px parent on Surface
 * whose folded sheet shows its top 100px, the drag handle and a dot, of a 300px sheet.
 */
@Component({
  selector: 'app-standard-bottom-sheet-reference',
  imports: [ExpStandardBottomSheet],
  template: `
    <div class="scene" data-reference>
      <exp-standard-bottom-sheet [peekHeight]="100">
        <span class="dot"></span>
        <div class="spacer"></div>
      </exp-standard-bottom-sheet>
    </div>
  `,
  styles: `
    @use '../../reference/compose-light-scheme' as compose;

    .scene {
      @include compose.compose-light-scheme;
      position: fixed;
      top: 0;
      left: 0;
      width: 360px;
      height: 240px;
      background: var(--mat-sys-surface);
    }

    .dot {
      display: block;
      width: 20px;
      height: 20px;
      margin: 16px;
      border-radius: 50%;
      background: currentColor;
    }

    .spacer {
      height: 200px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandardBottomSheetReference {}
