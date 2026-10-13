import { ExpIconButton } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';

/** The items of `Items()` in reference/compose `FloatingToolbarTest`. */
@Component({
  selector: 'app-floating-toolbar-items',
  imports: [MatIconButton, ExpIconButton],
  template: `
    <button mat-icon-button expIconButton><span class="dot"></span></button>
    <button mat-icon-button expIconButton [selected]="true" [morph]="false"><span class="dot"></span></button>
    <button mat-icon-button expIconButton [selected]="false" [morph]="false"><span class="dot"></span></button>
    <button mat-icon-button expIconButton disabled><span class="dot"></span></button>
  `,
  styles: `
    :host {
      display: contents;
    }

    .dot {
      display: block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: currentColor;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingToolbarItems {}
