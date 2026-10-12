import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Must render the same scene as `CornerTest.largeIncreased` in reference/compose. */
@Component({
  selector: 'app-corner-large-increased',
  template: `<div class="scene" data-reference><div class="shape"></div></div>`,
  styles: `
    .scene {
      position: fixed;
      top: 0;
      left: 0;
      padding: 12px;
      background: white;
    }

    .shape {
      width: 96px;
      height: 96px;
      background: black;
      border-radius: var(--exp-corner-large-increased);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CornerLargeIncreased {}
