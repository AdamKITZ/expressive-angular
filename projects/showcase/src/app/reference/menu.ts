import { ExpMenuGroup } from '@adam01230/expressive-angular';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  Signal,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

/**
 * Must render the same scene as `MenuTest.groups` in reference/compose: a menu of one group with a plain, a selected,
 * an icon and a disabled item, and a menu of two groups, the first with a label. Both menus open on load, each from
 * a trigger of no height at its top left corner, so the overlay lands on the scene.
 */
@Component({
  selector: 'app-menu-reference',
  imports: [ExpMenuGroup, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger],
  providers: [{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }],
  template: `
    <div class="menu-scene" data-reference>
      <span class="menu-scene-trigger" [matMenuTriggerFor]="single"></span>
      <span class="menu-scene-trigger" [matMenuTriggerFor]="grouped"></span>
    </div>
    <mat-menu #single="matMenu" class="menu-scene-panel" [hasBackdrop]="false">
      <button mat-menu-item><span class="menu-scene-bar"></span></button>
      <button mat-menu-item class="exp-menu-item-selected"><span class="menu-scene-bar"></span></button>
      <button mat-menu-item>
        <mat-icon class="menu-scene-dot" />
        <span class="menu-scene-bar"></span>
      </button>
      <button mat-menu-item disabled><span class="menu-scene-bar"></span></button>
    </mat-menu>
    <mat-menu #grouped="matMenu" class="menu-scene-panel" [hasBackdrop]="false">
      <exp-menu-group label="Label">
        <button mat-menu-item><span class="menu-scene-bar"></span></button>
        <button mat-menu-item><span class="menu-scene-bar"></span></button>
      </exp-menu-group>
      <exp-menu-group>
        <button mat-menu-item><span class="menu-scene-bar"></span></button>
      </exp-menu-group>
    </mat-menu>
  `,
  styles: `
    @use '../../reference/compose-light-scheme' as compose;

    .menu-scene,
    .menu-scene-panel {
      @include compose.compose-light-scheme;
    }

    .menu-scene {
      position: fixed;
      top: 0;
      left: 0;
      width: 436px;
      height: 220px;
      background: var(--mat-sys-surface);
    }

    .menu-scene-trigger {
      position: absolute;
      top: 12px;
      left: 12px;
      width: 200px;
    }

    .menu-scene-trigger + .menu-scene-trigger {
      left: 224px;
    }

    .menu-scene-panel.mat-mdc-menu-panel {
      width: 200px;
    }

    .menu-scene-bar {
      display: block;
      width: 80px;
      height: 20px;
      background: currentColor;
    }

    .menu-scene-dot {
      border-radius: 50%;
      background: currentColor;
    }

    /* The label stands in for text as a bar, like the items. */
    .menu-scene-panel .exp-menu-group-label {
      color: transparent;
    }

    .menu-scene-panel .exp-menu-group-label::before {
      width: 60px;
      height: 20px;
      background: var(--mat-sys-on-surface);
      content: '';
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuReference {
  private readonly triggers: Signal<readonly MatMenuTrigger[]> = viewChildren(MatMenuTrigger);

  constructor() {
    afterNextRender(() => {
      for (const trigger of this.triggers()) trigger.openMenu();
      // The menu focuses its first item after it renders; the scene shows the items at rest.
      setTimeout(() => (document.activeElement as HTMLElement | null)?.blur());
    });
  }
}
