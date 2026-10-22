import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Must render the same scene as `CardTest.cards` in reference/compose. The cards are the three clickable kinds, which
 * must look the same at rest as a plain card.
 */
@Component({
  selector: 'app-card-reference',
  template: `
    <div class="scene" data-reference>
      <button class="exp-card" type="button"><span class="dot"></span></button>
      <a class="exp-card-elevated" href="#"><span class="dot"></span></a>
      <div class="exp-card-outlined">
        <a class="exp-card-action" href="#"><span class="dot"></span></a>
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
      background: var(--mat-sys-surface);
    }

    .exp-card,
    .exp-card-elevated,
    .exp-card-outlined {
      padding: 16px;
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
export class CardReference {}
