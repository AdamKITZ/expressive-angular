import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import {
  ConnectedPosition,
  createFlexibleConnectedPositionStrategy,
  createOverlayRef,
  createRepositionScrollStrategy,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  InputSignal,
  Signal,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';

export type ExpRichTooltipPosition = 'above' | 'below';

type Opener = 'pointer' | 'keyboard' | 'touch' | 'click';

let nextId = 0;

/** The tooltip's title. A tooltip with actions is named by it. */
@Directive({
  selector: '[expRichTooltipSubhead]',
  host: { class: 'exp-rich-tooltip-subhead', '[id]': 'id' },
})
export class ExpRichTooltipSubhead {
  public readonly id: string = `exp-rich-tooltip-subhead-${nextId++}`;
}

/** Holds the tooltip's text buttons. Its presence makes the tooltip persistent. */
@Directive({ selector: '[expRichTooltipActions]', host: { class: 'exp-rich-tooltip-actions' } })
export class ExpRichTooltipActions {}

/**
 * A rich tooltip (Compose `RichTooltip`): an optional `expRichTooltipSubhead`, any HTML as supporting text and an
 * optional `expRichTooltipActions` row, opened by an `expRichTooltipTriggerFor` on another element. Without actions
 * it is a plain tooltip; with actions it is persistent and becomes a non-modal dialog, because content with buttons
 * must not be `role="tooltip"`. Needs the `rich-tooltip` Sass mixin once in the app's styles.
 */
@Component({
  selector: 'exp-rich-tooltip',
  template: `
    <ng-template>
      <div
        class="exp-rich-tooltip"
        [class.exp-rich-tooltip-plain]="!subhead() && !persistent()"
        [id]="id"
        [attr.role]="persistent() ? 'dialog' : 'tooltip'"
        [attr.aria-labelledby]="persistent() ? subhead()?.id : null"
      >
        <ng-content select="[expRichTooltipSubhead]" />
        <div class="exp-rich-tooltip-text"><ng-content /></div>
        <ng-content select="[expRichTooltipActions]" />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpRichTooltip {
  public readonly id: string = `exp-rich-tooltip-${nextId++}`;
  public readonly template: Signal<TemplateRef<unknown>> = viewChild.required(TemplateRef);
  public readonly persistent: Signal<boolean> = computed(() => this.actions() !== undefined);

  protected readonly subhead: Signal<ExpRichTooltipSubhead | undefined> = contentChild(ExpRichTooltipSubhead);
  private readonly actions: Signal<ExpRichTooltipActions | undefined> = contentChild(ExpRichTooltipActions);
}

/** Compose's `SpacingBetweenTooltipAndAnchor`. */
const GAP = 4;
const POSITIONS: Record<ExpRichTooltipPosition, ConnectedPosition> = {
  above: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -GAP },
  below: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: GAP },
};
/** Compose `BasicTooltipDefaults.TooltipDuration`: how long a long-pressed tooltip stays. */
const TOUCH_DURATION = 1500;
const LONG_PRESS = 500;
/** Lets the pointer cross the gap into the tooltip, which WCAG 1.4.13 requires and Compose doesn't do. */
const LEAVE_GRACE = 100;

/**
 * Opens an `exp-rich-tooltip` next to this element. A mouse hover, keyboard focus or a touch long press shows it, as
 * in Compose. A plain tooltip hides when pointer and focus have left both the anchor and the tooltip, or on Escape.
 * A persistent one (with actions) also opens on click and stays until a click outside, Escape or another click on the
 * anchor; it sits right after the anchor in the DOM, so Tab moves from the anchor into its actions.
 */
@Directive({
  selector: '[expRichTooltipTriggerFor]',
  host: {
    '[attr.aria-describedby]': 'tooltip().persistent() ? null : tooltip().id',
    '[attr.aria-haspopup]': "tooltip().persistent() ? 'dialog' : null",
    '[attr.aria-expanded]': 'tooltip().persistent() ? open() : null',
    '[attr.aria-controls]': 'tooltip().persistent() && open() ? tooltip().id : null',
    '(pointerenter)': 'pointerEnter($event)',
    '(pointerleave)': 'leave()',
    '(pointerdown)': 'pointerDown($event)',
    '(pointerup)': 'cancelLongPress()',
    '(pointercancel)': 'cancelLongPress()',
    '(focusout)': 'focusOut($event)',
    '(click)': 'click()',
    '(keydown.escape)': 'hide()',
  },
})
export class ExpRichTooltipTrigger {
  public readonly tooltip: InputSignal<ExpRichTooltip> = input.required<ExpRichTooltip>({
    alias: 'expRichTooltipTriggerFor',
  });
  public readonly expRichTooltipPosition: InputSignal<ExpRichTooltipPosition> = input<ExpRichTooltipPosition>('above');

  protected readonly open: WritableSignal<boolean> = signal(false);

  private readonly anchor: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector: Injector = inject(Injector);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly focusMonitor: FocusMonitor = inject(FocusMonitor);
  private overlayRef?: OverlayRef;
  private openedBy?: Opener;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private longPress?: ReturnType<typeof setTimeout>;

  constructor() {
    this.focusMonitor.monitor(this.anchor).subscribe((origin: FocusOrigin) => {
      if (origin === 'keyboard') {
        this.show('keyboard');
      }
    });
    inject(DestroyRef).onDestroy(() => {
      this.focusMonitor.stopMonitoring(this.anchor);
      clearTimeout(this.longPress);
      clearTimeout(this.hideTimer);
      this.overlayRef?.dispose();
    });
  }

  protected show(by: Opener): void {
    clearTimeout(this.hideTimer);
    if (!this.open()) {
      this.openedBy = by;
    }
    const overlayRef = (this.overlayRef ??= this.createOverlay());
    overlayRef.overlayElement.firstElementChild?.classList.remove('exp-rich-tooltip-closing');
    if (!overlayRef.hasAttached()) {
      overlayRef.attach(new TemplatePortal(this.tooltip().template(), this.viewContainerRef));
    }
    this.open.set(true);
  }

  protected hide(): void {
    clearTimeout(this.hideTimer);
    const overlayRef = this.overlayRef;
    if (!this.open() || !overlayRef) {
      return;
    }
    this.open.set(false);
    if (overlayRef.overlayElement.contains(document.activeElement)) {
      this.focusMonitor.focusVia(this.anchor, 'program');
    }
    const element = overlayRef.overlayElement.firstElementChild!;
    element.classList.add('exp-rich-tooltip-closing');
    const animations = element.getAnimations?.({ subtree: true }) ?? [];
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (!this.open()) {
        overlayRef.detach();
      }
    });
  }

  protected pointerEnter(event: PointerEvent): void {
    if (event.pointerType !== 'touch') {
      this.show('pointer');
    }
  }

  protected leave(): void {
    if (!this.tooltip().persistent() && this.openedBy !== 'keyboard') {
      clearTimeout(this.hideTimer);
      this.hideTimer = setTimeout(() => this.hide(), LEAVE_GRACE);
    }
  }

  protected pointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'touch' || this.tooltip().persistent()) {
      return;
    }
    clearTimeout(this.longPress);
    this.longPress = setTimeout(() => {
      this.show('touch');
      this.hideTimer = setTimeout(() => this.hide(), TOUCH_DURATION);
    }, LONG_PRESS);
  }

  protected cancelLongPress(): void {
    clearTimeout(this.longPress);
  }

  protected focusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!this.anchor.contains(next) && !this.overlayRef?.overlayElement.contains(next)) {
      this.hide();
    }
  }

  protected click(): void {
    if (!this.tooltip().persistent()) {
      return;
    }
    if (this.open() && this.openedBy === 'click') {
      this.hide();
    } else {
      this.show('click');
      this.openedBy = 'click';
    }
  }

  private createOverlay(): OverlayRef {
    const positions =
      this.expRichTooltipPosition() === 'above'
        ? [POSITIONS.above, POSITIONS.below]
        : [POSITIONS.below, POSITIONS.above];
    const overlayRef = createOverlayRef(this.injector, {
      positionStrategy: createFlexibleConnectedPositionStrategy(this.injector, this.anchor)
        .withPositions(positions)
        .withFlexibleDimensions(false)
        .withPush(true)
        .withViewportMargin(8)
        .withTransformOriginOn('.exp-rich-tooltip')
        .withPopoverLocation('inline'),
      scrollStrategy: createRepositionScrollStrategy(this.injector),
    });
    const pane = overlayRef.overlayElement;
    pane.addEventListener('pointerenter', () => clearTimeout(this.hideTimer));
    pane.addEventListener('pointerleave', () => this.leave());
    pane.addEventListener('focusout', (event) => this.focusOut(event));
    overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.hide();
      }
    });
    overlayRef.outsidePointerEvents().subscribe((event) => {
      if (!this.anchor.contains(event.target as Node)) {
        this.hide();
      }
    });
    return overlayRef;
  }
}
