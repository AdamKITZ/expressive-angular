import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  Signal,
  viewChild,
} from '@angular/core';

import { settle } from './settle';

/** Compose's touch slop: how far a pointer moves before the move counts as a drag. */
const dragSlop = 8;

interface Drag {
  pointerId: number;
  startY: number;
  startOffset: number;
  lastY: number;
  lastTime: number;
  velocity: number;
  dragging: boolean;
  fromContent: boolean;
}

/**
 * The sheet of Compose's `BottomSheetScaffold`: a non-modal sheet at the bottom of its positioned parent that shows its
 * top `peekHeight` pixels and opens fully on a drag up or a click on its drag handle, without a scrim, so the content
 * behind stays usable. `expanded` tells and sets whether it is fully open. The strip with the drag handle can always be
 * dragged and the rest of the sheet while folded. Open, the content scrolls natively, and pulling it down while it is
 * scrolled to the top drags the sheet instead. Leave room
 * for the peek height under the parent's own content. Needs the `bottom-sheet` Sass mixin once in the app's styles.
 */
@Component({
  selector: 'exp-standard-bottom-sheet',
  host: { class: 'exp-standard-bottom-sheet-host' },
  template: `
    <div
      #sheet
      class="exp-standard-bottom-sheet"
      [class.exp-bottom-sheet-partial]="!expanded()"
      (pointerdown)="startDrag($event)"
      (pointermove)="moveDrag($event)"
      (pointerup)="endDrag()"
      (pointercancel)="endDrag()"
      (touchmove)="holdScroll($event)"
      (wheel)="$event.deltaY > 0 && expanded.set(true)"
    >
      <div class="exp-bottom-sheet-handle-strip">
        <button
          type="button"
          class="exp-bottom-sheet-handle"
          [attr.aria-label]="handleLabel()"
          [attr.aria-expanded]="expanded()"
          (click)="!wasDragged() && expanded.set(!expanded())"
        ></button>
      </div>
      <div #content class="exp-bottom-sheet-content"><ng-content /></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpStandardBottomSheet {
  public readonly expanded: ModelSignal<boolean> = model(false);
  public readonly peekHeight: InputSignal<number> = input(56);
  public readonly handleLabel: InputSignal<string> = input('Drag handle');

  private readonly sheet: Signal<ElementRef<HTMLElement>> = viewChild.required('sheet');
  private readonly content: Signal<ElementRef<HTMLElement>> = viewChild.required('content');
  private offset: number = 0;
  private drag: Drag | null = null;
  private dragged: boolean = false;

  constructor() {
    effect(() => this.moveTo(this.expanded() ? 0 : this.anchors().partial));
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const size = new ResizeObserver(() => this.moveTo(this.expanded() ? 0 : this.anchors().partial));
      size.observe(this.sheet().nativeElement);
      destroyRef.onDestroy(() => size.disconnect());
    });
  }

  protected wasDragged(): boolean {
    const dragged = this.dragged;
    this.dragged = false;
    return dragged;
  }

  protected startDrag(event: PointerEvent): void {
    const onStrip = (event.target as Element).closest('.exp-bottom-sheet-handle-strip') !== null;
    const fromContent = !onStrip && this.expanded();
    if (event.button !== 0 || (fromContent && this.content().nativeElement.scrollTop > 0)) {
      return;
    }
    this.drag = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startOffset: this.offset,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocity: 0,
      dragging: false,
      fromContent,
    };
  }

  protected moveDrag(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    const sheet = this.sheet().nativeElement;
    if (!drag.dragging) {
      if (Math.abs(event.clientY - drag.startY) < dragSlop) {
        return;
      }
      if (drag.fromContent && event.clientY < drag.startY) {
        this.drag = null;
        return;
      }
      drag.dragging = true;
      window.getSelection()?.removeAllRanges();
      sheet.setPointerCapture(event.pointerId);
      sheet.classList.add('exp-bottom-sheet-dragging');
    }
    const elapsed = event.timeStamp - drag.lastTime;
    if (elapsed > 0) {
      drag.velocity = (event.clientY - drag.lastY) / elapsed;
    }
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;
    this.moveTo(Math.min(Math.max(drag.startOffset + event.clientY - drag.startY, 0), this.anchors().partial));
  }

  /** Only a cancelled touchmove keeps the browser from scrolling the content while a touch pulls the sheet. */
  protected holdScroll(event: TouchEvent): void {
    const drag = this.drag;
    if (drag?.fromContent && event.cancelable && (drag.dragging || event.touches[0].clientY > drag.startY)) {
      event.preventDefault();
    }
  }

  protected endDrag(): void {
    const drag = this.drag;
    this.drag = null;
    if (!drag?.dragging) {
      return;
    }
    this.dragged = true;
    this.sheet().nativeElement.classList.remove('exp-bottom-sheet-dragging');
    const { partial } = this.anchors();
    const target = settle([0, partial], drag.startOffset, this.offset, drag.velocity);
    this.expanded.set(target === 0);
    this.moveTo(target);
  }

  private anchors(): { partial: number } {
    return { partial: Math.max(this.sheet().nativeElement.offsetHeight - this.peekHeight(), 0) };
  }

  private moveTo(offset: number): void {
    this.offset = offset;
    this.sheet().nativeElement.style.setProperty('--exp-bottom-sheet-offset', `${offset}px`);
  }
}
