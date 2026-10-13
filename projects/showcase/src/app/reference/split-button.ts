import { ExpSplitButton } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton, MatButtonAppearance } from '@angular/material/button';

/** Must render the same scene as `SplitButtonTest.styles` in reference/compose. */
@Component({
  selector: 'app-split-button-reference',
  imports: [MatButton, ExpSplitButton],
  template: `
    <div class="scene" data-reference>
      @for (appearance of appearances; track appearance) {
        <div class="row">
          @for (state of states; track state) {
            <exp-split-button>
              <button [matButton]="appearance" [disabled]="state === 'disabled'"><span class="dot"></span></button>
              <button
                [matButton]="appearance"
                [disabled]="state === 'disabled'"
                [attr.aria-expanded]="state === 'checked'"
              >
                <span class="dot trailing"></span>
              </button>
            </exp-split-button>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './split-button-scene.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitButtonReference {
  protected readonly appearances: MatButtonAppearance[] = ['filled', 'tonal', 'elevated', 'outlined'];
  protected readonly states: string[] = ['default', 'checked', 'disabled'];
}
