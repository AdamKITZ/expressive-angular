import { ExpFloatingToolbar, ExpToolbarFab } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFabButton } from '@angular/material/button';

import { FloatingToolbarItems } from './floating-toolbar-items';

/** Must render the same scene as `FloatingToolbarTest.withFab` in reference/compose. */
@Component({
  selector: 'app-floating-toolbar-fab-reference',
  imports: [MatFabButton, ExpFloatingToolbar, ExpToolbarFab, FloatingToolbarItems],
  template: `
    <div class="scene" data-reference>
      <div class="row">
        <exp-floating-toolbar>
          <app-floating-toolbar-items />
          <button matFab expToolbarFab><span class="dot"></span></button>
        </exp-floating-toolbar>
        <exp-floating-toolbar orientation="vertical" vibrant>
          <app-floating-toolbar-items />
          <button matFab expToolbarFab><span class="dot"></span></button>
        </exp-floating-toolbar>
      </div>
    </div>
  `,
  styleUrl: './floating-toolbar-scene.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingToolbarFabReference {}
