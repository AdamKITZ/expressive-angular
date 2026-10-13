import { ExpFloatingToolbar } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FloatingToolbarItems } from './floating-toolbar-items';

/** Must render the same scene as `FloatingToolbarTest.toolbars` in reference/compose. */
@Component({
  selector: 'app-floating-toolbar-reference',
  imports: [ExpFloatingToolbar, FloatingToolbarItems],
  template: `
    <div class="scene" data-reference>
      <exp-floating-toolbar><app-floating-toolbar-items /></exp-floating-toolbar>
      <exp-floating-toolbar vibrant><app-floating-toolbar-items /></exp-floating-toolbar>
      <div class="row">
        <exp-floating-toolbar orientation="vertical"><app-floating-toolbar-items /></exp-floating-toolbar>
        <exp-floating-toolbar orientation="vertical" vibrant><app-floating-toolbar-items /></exp-floating-toolbar>
      </div>
    </div>
  `,
  styleUrl: './floating-toolbar-scene.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingToolbarReference {}
