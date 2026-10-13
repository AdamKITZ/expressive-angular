import { ExpDockedToolbar } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FloatingToolbarItems } from './floating-toolbar-items';

/** Must render the same scene as `DockedToolbarTest.arrangements` in reference/compose. */
@Component({
  selector: 'app-docked-toolbar-reference',
  imports: [ExpDockedToolbar, FloatingToolbarItems],
  template: `
    <div class="scene" data-reference>
      <exp-docked-toolbar><app-floating-toolbar-items /></exp-docked-toolbar>
      <exp-docked-toolbar arrangement="fixed"><app-floating-toolbar-items /></exp-docked-toolbar>
    </div>
  `,
  styles: `
    exp-docked-toolbar {
      width: 360px;
    }
  `,
  styleUrl: './floating-toolbar-scene.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockedToolbarReference {}
