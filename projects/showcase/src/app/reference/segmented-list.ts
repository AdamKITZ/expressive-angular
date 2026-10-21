import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `SegmentedListTest.lists` in reference/compose. The first list's items are the three
 * clickable kinds, which must look the same at rest as a plain item.
 */
@Component({
  selector: 'app-segmented-list-reference',
  template: `
    <div class="scene" data-reference>
      <div class="exp-segmented-list">
        <button class="item" type="button"><span class="dot"></span></button>
        <a class="item" href="#"><span class="dot"></span></a>
        <div class="item">
          <a class="exp-segmented-list-action" href="#"><span class="dot"></span></a>
        </div>
      </div>
      <div class="exp-segmented-list">
        <div class="item"><span class="dot"></span></div>
      </div>
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
      gap: 16px;
      width: 240px;
      padding: 12px;
      background: var(--mat-sys-surface-container);
    }

    .item {
      display: flex;
      align-items: center;
    }

    .dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedListReference {}
