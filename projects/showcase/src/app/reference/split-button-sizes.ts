import { ExpSplitButton, ExpSplitButtonSize } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

/** Must render the same scene as `SplitButtonTest.sizes` in reference/compose. */
@Component({
  selector: 'app-split-button-sizes-reference',
  imports: [MatButton, ExpSplitButton],
  template: `
    <div class="scene" data-reference>
      @for (size of sizes; track size) {
        <div class="row">
          @for (checked of [false, true]; track checked) {
            <exp-split-button [size]="size">
              <button matButton="tonal"><span class="dot"></span></button>
              <button matButton="tonal" [attr.aria-expanded]="checked"><span class="dot trailing"></span></button>
            </exp-split-button>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './split-button-scene.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitButtonSizesReference {
  protected readonly sizes: ExpSplitButtonSize[] = ['xs', 's', 'm', 'l', 'xl'];
}
