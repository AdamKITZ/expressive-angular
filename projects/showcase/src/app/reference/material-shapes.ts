import { EXP_SHAPE_NAMES, expShapePath } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Must render the same scene as `MaterialShapesTest.all` in reference/compose. */
@Component({
  selector: 'app-material-shapes-reference',
  template: `
    <div class="scene" data-reference>
      @for (path of paths; track $index) {
        <svg width="48" height="48" aria-hidden="true"><path [attr.d]="path" /></svg>
      }
    </div>
  `,
  styles: `
    .scene {
      position: fixed;
      top: 0;
      left: 0;
      display: grid;
      grid-template-columns: repeat(7, 48px);
      gap: 8px;
      padding: 12px;
      background: white;
    }

    svg {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialShapesReference {
  protected readonly paths: readonly string[] = EXP_SHAPE_NAMES.map((name) => expShapePath(name, 48));
}
