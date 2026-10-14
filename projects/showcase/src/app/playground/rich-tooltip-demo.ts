import {
  ExpRichTooltip,
  ExpRichTooltipActions,
  ExpRichTooltipSubhead,
  ExpRichTooltipTrigger,
} from '@adam01230/expressive-angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-rich-tooltip-demo',
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    ExpRichTooltip,
    ExpRichTooltipActions,
    ExpRichTooltipSubhead,
    ExpRichTooltipTrigger,
  ],
  template: `
    <div class="row">
      <button matIconButton aria-label="About retention" [expRichTooltipTriggerFor]="retention">
        <mat-icon>info</mat-icon>
      </button>
      <button matButton="tonal" [expRichTooltipTriggerFor]="shortcuts" expRichTooltipPosition="below">Shortcuts</button>
      <button matIconButton aria-label="About exports" [expRichTooltipTriggerFor]="exports">
        <mat-icon>help</mat-icon>
      </button>
    </div>

    <exp-rich-tooltip #retention>
      <span expRichTooltipSubhead>Retention</span>
      Entries older than <strong>90 days</strong> are deleted every night. Exports you downloaded stay on your device.
    </exp-rich-tooltip>

    <exp-rich-tooltip #shortcuts>
      <kbd>Ctrl</kbd> + <kbd>K</kbd> opens search, <kbd>Ctrl</kbd> + <kbd>S</kbd> saves.
    </exp-rich-tooltip>

    <exp-rich-tooltip #exports>
      <span expRichTooltipSubhead>Exports</span>
      Download everything as CSV or JSON. Large exports arrive by email.
      <div expRichTooltipActions>
        <button matButton>Learn more</button>
        <button matButton>Export</button>
      </div>
    </exp-rich-tooltip>
  `,
  styles: `
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTooltipDemo {}
