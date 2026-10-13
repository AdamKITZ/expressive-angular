import {
  ExpButton,
  ExpButtonGroup,
  ExpIconButton,
  ExpIconButtonAppearance,
  ExpIconButtonShape,
} from '@adam01230/expressive-angular';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

type Column = 'action' | 'unselected' | 'selected' | 'static';
type Size = 'xs' | 's' | 'm' | 'l' | 'xl';
type Width = 'narrow' | 'uniform' | 'wide';

/** Mirrors the `$sizes` map in the icon-button mixin, for the caption only. */
const SIZES: Record<
  Size,
  {
    height: number;
    icon: number;
    widths: Record<Width, number>;
    square: number;
    pressed: number;
    selected: number;
  }
> = {
  xs: { height: 32, icon: 20, widths: { narrow: 28, uniform: 32, wide: 40 }, square: 12, pressed: 8, selected: 12 },
  s: { height: 40, icon: 24, widths: { narrow: 32, uniform: 40, wide: 52 }, square: 12, pressed: 8, selected: 12 },
  m: { height: 56, icon: 24, widths: { narrow: 48, uniform: 56, wide: 72 }, square: 16, pressed: 12, selected: 16 },
  l: { height: 96, icon: 32, widths: { narrow: 64, uniform: 96, wide: 128 }, square: 28, pressed: 16, selected: 28 },
  xl: {
    height: 136,
    icon: 40,
    widths: { narrow: 104, uniform: 136, wide: 184 },
    square: 28,
    pressed: 16,
    selected: 28,
  },
};

@Component({
  selector: 'app-icon-button-matrix',
  imports: [MatButton, MatIconButton, MatIcon, ExpButton, ExpButtonGroup, ExpIconButton],
  template: `
    <div class="switches">
      <exp-button-group aria-label="Size" connected [value]="size()" (valueChange)="size.set($any($event))">
        @for (option of sizes; track option) {
          <button matButton="tonal" expButton [value]="option">{{ option }}</button>
        }
      </exp-button-group>
      <exp-button-group aria-label="Width" connected [value]="width()" (valueChange)="width.set($any($event))">
        @for (option of widths; track option) {
          <button matButton="tonal" expButton [value]="option">{{ option }}</button>
        }
      </exp-button-group>
      <exp-button-group aria-label="Shape family" connected [value]="shape()" (valueChange)="shape.set($any($event))">
        @for (option of shapes; track option) {
          <button matButton="tonal" expButton [value]="option">{{ option }}</button>
        }
      </exp-button-group>
    </div>

    <div class="scroll">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>default</th>
            <th>toggle unselected</th>
            <th>toggle selected</th>
            <th>toggle, no morph</th>
          </tr>
        </thead>
        <tbody>
          @for (appearance of appearances; track appearance) {
            <tr>
              <th scope="row">{{ appearance }}</th>
              @for (column of columns; track column) {
                <td>
                  <button
                    mat-icon-button
                    expIconButton
                    [appearance]="appearance"
                    [size]="size()"
                    [width]="width()"
                    [shape]="shape()"
                    [morph]="column !== 'static'"
                    [selected]="column === 'action' ? undefined : isSelected(appearance, column)"
                    [disabled]="disabled()"
                    [attr.aria-label]="appearance + ' ' + column"
                    (click)="column !== 'action' && toggle(appearance, column)"
                  >
                    <mat-icon>{{
                      column === 'action' ? 'edit' : isSelected(appearance, column) ? 'favorite' : 'favorite_border'
                    }}</mat-icon>
                  </button>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
    <p class="caption">{{ caption() }}</p>
  `,
  styles: `
    .switches {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .scroll {
      overflow-x: auto;
      margin-top: 16px;
    }

    th {
      padding: 4px 8px;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-label-medium);
      text-align: start;
      white-space: nowrap;
    }

    td {
      padding: 8px;
      text-align: center;
    }

    .caption {
      margin: 8px 0 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-small);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonMatrix {
  public readonly disabled: InputSignal<boolean> = input(false);

  protected readonly appearances: ExpIconButtonAppearance[] = ['filled', 'tonal', 'outlined', 'standard'];
  protected readonly columns: Column[] = ['action', 'unselected', 'selected', 'static'];
  protected readonly sizes: Size[] = ['xs', 's', 'm', 'l', 'xl'];
  protected readonly widths: Width[] = ['narrow', 'uniform', 'wide'];
  protected readonly shapes: ExpIconButtonShape[] = ['round', 'square'];

  protected readonly size: WritableSignal<Size> = signal('s');
  protected readonly width: WritableSignal<Width> = signal('uniform');
  protected readonly shape: WritableSignal<ExpIconButtonShape> = signal('round');
  protected readonly caption: Signal<string> = computed(() => {
    const size = SIZES[this.size()];
    const width = size.widths[this.width()];
    const full = Math.min(width, size.height) / 2;
    const rest = this.shape() === 'round' ? full : size.square;
    const selected = this.shape() === 'round' ? size.selected : full;
    return `${width}px × ${size.height}px, glyph ${size.icon}px. Corners: rest ${rest}px, pressed ${size.pressed}px, selected ${selected}px.`;
  });

  private readonly toggled: WritableSignal<Set<string>> = signal(new Set());

  protected isSelected(appearance: ExpIconButtonAppearance, column: Column): boolean {
    return (column !== 'unselected') !== this.toggled().has(`${appearance}-${column}`);
  }

  protected toggle(appearance: ExpIconButtonAppearance, column: Column): void {
    const key = `${appearance}-${column}`;
    this.toggled.update((toggled) => {
      const next = new Set(toggled);
      if (!next.delete(key)) next.add(key);
      return next;
    });
  }
}
