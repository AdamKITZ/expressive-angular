import { ExpButton, ExpButtonGroup, ExpSplitButton, ExpSplitButtonSize } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { MatButton, MatButtonAppearance } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-split-button-demo',
  imports: [MatButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, ExpButton, ExpButtonGroup, ExpSplitButton],
  template: `
    <exp-button-group aria-label="Split button size" connected [value]="size()" (valueChange)="size.set($any($event))">
      @for (option of sizes; track option) {
        <button matButton="tonal" expButton [value]="option">{{ option }}</button>
      }
    </exp-button-group>

    <div class="row">
      @for (appearance of appearances; track appearance) {
        <exp-split-button [size]="size()">
          <button [matButton]="appearance" [disabled]="disabled()">
            <mat-icon>edit</mat-icon>
            {{ appearance }}
          </button>
          <button
            [matButton]="appearance"
            [disabled]="disabled()"
            [matMenuTriggerFor]="menu"
            [attr.aria-label]="appearance + ' options'"
          >
            <mat-icon>keyboard_arrow_down</mat-icon>
          </button>
        </exp-split-button>
      }
      <exp-split-button [size]="size()">
        <button matButton="filled" aria-label="Send" [disabled]="disabled()"><mat-icon>send</mat-icon></button>
        <button matButton="filled" aria-label="Send options" [disabled]="disabled()" [matMenuTriggerFor]="menu">
          <mat-icon>keyboard_arrow_down</mat-icon>
        </button>
      </exp-split-button>
    </div>

    <mat-menu #menu="matMenu">
      <button mat-menu-item>Duplicate</button>
      <button mat-menu-item>Share</button>
      <button mat-menu-item>Archive</button>
    </mat-menu>
  `,
  styles: `
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitButtonDemo {
  public readonly disabled: InputSignal<boolean> = input(false);

  protected readonly appearances: MatButtonAppearance[] = ['filled', 'tonal', 'elevated', 'outlined'];
  protected readonly sizes: ExpSplitButtonSize[] = ['xs', 's', 'm', 'l', 'xl'];
  protected readonly size: WritableSignal<ExpSplitButtonSize> = signal('s');
}
