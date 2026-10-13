import { ExpButton, ExpFloatingToolbar, ExpIconButton, ExpToolbarFab } from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-toolbar-demo',
  imports: [
    MatButton,
    MatFabButton,
    MatIconButton,
    MatIcon,
    MatTooltip,
    ExpButton,
    ExpFloatingToolbar,
    ExpIconButton,
    ExpToolbarFab,
  ],
  template: `
    <button matButton="tonal" expButton [selected]="expanded()" (click)="expanded.set(!expanded())">Expanded</button>

    <h3>Editor, standard, with toggles</h3>
    <exp-floating-toolbar aria-label="Text formatting" [expanded]="expanded()">
      <button
        mat-icon-button
        expIconButton
        expToolbarLeading
        aria-label="Undo"
        matTooltip="Undo"
        [disabled]="disabled()"
      >
        <mat-icon>undo</mat-icon>
      </button>
      @for (format of formats; track format.key) {
        <button
          mat-icon-button
          expIconButton
          [morph]="false"
          [attr.aria-label]="format.label"
          [matTooltip]="format.label"
          [selected]="active()[format.key]"
          [disabled]="disabled()"
          (click)="toggle(format.key)"
        >
          <mat-icon>{{ format.icon }}</mat-icon>
        </button>
      }
      <button
        mat-icon-button
        expIconButton
        expToolbarTrailing
        aria-label="More"
        matTooltip="More"
        [disabled]="disabled()"
      >
        <mat-icon>more_vert</mat-icon>
      </button>
    </exp-floating-toolbar>

    <h3>Editor, vibrant, with toggles</h3>
    <exp-floating-toolbar aria-label="Text formatting" vibrant [expanded]="expanded()">
      <button mat-icon-button expIconButton expToolbarLeading aria-label="Undo" [disabled]="disabled()">
        <mat-icon>undo</mat-icon>
      </button>
      @for (format of formats; track format.key) {
        <button
          mat-icon-button
          expIconButton
          [morph]="false"
          [attr.aria-label]="format.label"
          [selected]="active()[format.key]"
          [disabled]="disabled()"
          (click)="toggle(format.key)"
        >
          <mat-icon>{{ format.icon }}</mat-icon>
        </button>
      }
      <button mat-icon-button expIconButton expToolbarTrailing aria-label="More" [disabled]="disabled()">
        <mat-icon>more_vert</mat-icon>
      </button>
    </exp-floating-toolbar>

    <h3>Media player, vibrant, with a filled action</h3>
    <exp-floating-toolbar aria-label="Player" vibrant [expanded]="expanded()">
      <button mat-icon-button expIconButton expToolbarLeading aria-label="Shuffle" [disabled]="disabled()">
        <mat-icon>shuffle</mat-icon>
      </button>
      <button mat-icon-button expIconButton aria-label="Previous" [disabled]="disabled()">
        <mat-icon>skip_previous</mat-icon>
      </button>
      <button
        mat-icon-button
        expIconButton
        appearance="filled"
        width="wide"
        [attr.aria-label]="playing() ? 'Pause' : 'Play'"
        [disabled]="disabled()"
        (click)="playing.set(!playing())"
      >
        <mat-icon>{{ playing() ? 'pause' : 'play_arrow' }}</mat-icon>
      </button>
      <button mat-icon-button expIconButton aria-label="Next" [disabled]="disabled()">
        <mat-icon>skip_next</mat-icon>
      </button>
      <button mat-icon-button expIconButton expToolbarTrailing aria-label="Repeat" [disabled]="disabled()">
        <mat-icon>repeat</mat-icon>
      </button>
    </exp-floating-toolbar>

    <h3>With a text button and a FAB</h3>
    <exp-floating-toolbar aria-label="Mail" [expanded]="expanded()">
      <button mat-icon-button expIconButton aria-label="Archive" [disabled]="disabled()">
        <mat-icon>archive</mat-icon>
      </button>
      <button mat-icon-button expIconButton aria-label="Delete" [disabled]="disabled()">
        <mat-icon>delete</mat-icon>
      </button>
      <button matButton [disabled]="disabled()">Mark read</button>
      <button matFab expToolbarFab aria-label="Compose" [disabled]="disabled()"><mat-icon>edit</mat-icon></button>
    </exp-floating-toolbar>

    <h3>Vertical, vibrant, with a FAB</h3>
    <exp-floating-toolbar aria-label="Map" orientation="vertical" vibrant [expanded]="expanded()">
      <button mat-icon-button expIconButton aria-label="Layers" [disabled]="disabled()">
        <mat-icon>layers</mat-icon>
      </button>
      <button
        mat-icon-button
        expIconButton
        [morph]="false"
        aria-label="Traffic"
        [selected]="active()['traffic']"
        [disabled]="disabled()"
        (click)="toggle('traffic')"
      >
        <mat-icon>traffic</mat-icon>
      </button>
      <button mat-icon-button expIconButton aria-label="My location" [disabled]="disabled()">
        <mat-icon>my_location</mat-icon>
      </button>
      <button matFab expToolbarFab aria-label="Directions" [disabled]="disabled()">
        <mat-icon>directions</mat-icon>
      </button>
    </exp-floating-toolbar>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    h3 {
      margin: 12px 0 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-label-large);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarDemo {
  public readonly disabled: InputSignal<boolean> = input(false);

  protected readonly formats: { key: string; label: string; icon: string }[] = [
    { key: 'bold', label: 'Bold', icon: 'format_bold' },
    { key: 'italic', label: 'Italic', icon: 'format_italic' },
    { key: 'underline', label: 'Underline', icon: 'format_underlined' },
  ];
  protected readonly expanded: WritableSignal<boolean> = signal(true);
  protected readonly playing: WritableSignal<boolean> = signal(false);
  protected readonly active: WritableSignal<Record<string, boolean>> = signal({ bold: true, traffic: true });

  protected toggle(key: string): void {
    this.active.update((active) => ({ ...active, [key]: !active[key] }));
  }
}
