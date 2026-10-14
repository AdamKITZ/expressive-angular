import { ExpRichTooltip, ExpRichTooltipActions, ExpRichTooltipSubhead } from '@adam01230/expressive-angular';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';

/**
 * Must render the same scene as `RichTooltipTest.variants` in reference/compose. The tooltips are stamped in place
 * instead of opened in an overlay, without the enter transition.
 */
@Component({
  selector: 'app-rich-tooltip-reference',
  imports: [NgTemplateOutlet, MatButton, ExpRichTooltip, ExpRichTooltipActions, ExpRichTooltipSubhead],
  template: `
    <div class="scene" data-reference>
      <ng-container [ngTemplateOutlet]="full.template()" />
      <ng-container [ngTemplateOutlet]="subhead.template()" />
      <ng-container [ngTemplateOutlet]="plain.template()" />
    </div>

    <exp-rich-tooltip #full>
      <span expRichTooltipSubhead>Title</span>
      Supporting text
      <div expRichTooltipActions><button matButton>Action</button></div>
    </exp-rich-tooltip>
    <exp-rich-tooltip #subhead>
      <span expRichTooltipSubhead>Title</span>
      Supporting text
    </exp-rich-tooltip>
    <exp-rich-tooltip #plain>Supporting text</exp-rich-tooltip>
  `,
  styles: `
    @use '../../reference/compose-light-scheme' as compose;

    .scene {
      @include compose.compose-light-scheme;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      background: var(--mat-sys-surface);
    }

    .scene .exp-rich-tooltip {
      width: 240px;
      transition: none;
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTooltipReference {}
