import {
  ExpButton,
  ExpButtonGroup,
  ExpCircularProgress,
  ExpLinearProgress,
  ExpLoadingIndicator,
} from '@adam01230/expressive-angular';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';

import { IconButtonMatrix } from './icon-button-matrix';
import { RichTooltipDemo } from './rich-tooltip-demo';
import { SplitButtonDemo } from './split-button-demo';
import { ToolbarDemo } from './toolbar-demo';

type Scheme = 'light dark' | 'light' | 'dark';

@Component({
  selector: 'app-playground',
  imports: [
    MatButton,
    ExpButton,
    ExpButtonGroup,
    ExpCircularProgress,
    ExpLinearProgress,
    ExpLoadingIndicator,
    IconButtonMatrix,
    RichTooltipDemo,
    SplitButtonDemo,
    ToolbarDemo,
  ],
  templateUrl: './playground.html',
  styleUrl: './playground.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Playground {
  protected readonly scheme: WritableSignal<Scheme> = signal<Scheme>('light dark');
  protected readonly disabled: WritableSignal<boolean> = signal(false);
  protected readonly formats: WritableSignal<Record<string, boolean>> = signal({ bold: true, italic: false });
  protected readonly range: WritableSignal<unknown> = signal('week');
  protected readonly size: WritableSignal<unknown> = signal('m');
  protected readonly progress: WritableSignal<number> = signal(40);

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
