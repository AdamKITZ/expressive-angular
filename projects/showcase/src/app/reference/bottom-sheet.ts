import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `BottomSheetTest.sheet` in reference/compose: the open sheet without its scrim, 360px
 * wide, on Surface. The dialog is shown with `open` instead of `showModal()` and the transform on the scene keeps it
 * inside the scene, so the screenshot holds only the sheet; the markup is what `exp-bottom-sheet` renders.
 */
@Component({
  selector: 'app-bottom-sheet-reference',
  template: `
    <div class="scene" data-reference>
      <dialog open class="exp-bottom-sheet">
        <div class="exp-bottom-sheet-handle-strip">
          <button type="button" class="exp-bottom-sheet-handle" aria-label="Drag handle"></button>
        </div>
        <div class="exp-bottom-sheet-content"><span class="dot"></span></div>
      </dialog>
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
      height: 100px;
      background: var(--mat-sys-surface);
      transform: translateZ(0);
    }

    .scene .exp-bottom-sheet {
      transition: none;
    }

    .dot {
      display: block;
      width: 20px;
      height: 20px;
      margin: 16px;
      border-radius: 50%;
      background: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetReference {}
