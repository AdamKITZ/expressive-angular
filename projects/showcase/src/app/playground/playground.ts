import { ExpButton, ExpButtonGroup, ExpIconButton, ExpLoadingIndicator } from '@adam01230/expressive-angular';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

type Scheme = 'light dark' | 'light' | 'dark';

@Component({
  selector: 'app-playground',
  imports: [MatButton, MatIconButton, MatIcon, ExpButton, ExpButtonGroup, ExpIconButton, ExpLoadingIndicator],
  templateUrl: './playground.html',
  styleUrl: './playground.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Playground {
  protected readonly scheme: WritableSignal<Scheme> = signal<Scheme>('light dark');
  protected readonly disabled: WritableSignal<boolean> = signal(false);
  protected readonly favorite: WritableSignal<boolean> = signal(false);
  protected readonly bookmarked: WritableSignal<boolean> = signal(true);
  protected readonly formats: WritableSignal<Record<string, boolean>> = signal({ bold: true, italic: false });
  protected readonly range: WritableSignal<unknown> = signal('week');
  protected readonly size: WritableSignal<unknown> = signal('m');

  private readonly document: Document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      this.document.documentElement.style.colorScheme = this.scheme();
    });
  }

  protected pickScheme(value: unknown): void {
    this.scheme.set(value as Scheme);
  }

  protected toggleFormat(format: string): void {
    this.formats.update((formats) => ({ ...formats, [format]: !formats[format] }));
  }
}
