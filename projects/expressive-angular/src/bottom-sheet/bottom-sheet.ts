import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
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
}

/**
 * Compose's `ModalBottomSheet`: a sheet that slides up from the bottom edge over a scrim while `open` is true. A sheet
 * taller than half the window opens half way and opens fully on a drag or scroll up; a drag down closes it. The strip
 * with the drag handle can always be dragged, the rest of the sheet only while it is half open, so that its content
 * keeps scrolling natively. It runs in a native modal `<dialog>`, which traps focus and closes on Escape; a click on
 * the scrim or on the drag handle of a fully open sheet closes it too. Needs the `bottom-sheet` Sass mixin once in the
 * app's styles.
 */
@Component({
  selector: 'exp-bottom-sheet',
  template: `
    <dialog
      #dialog
      class="exp-bottom-sheet"
      [attr.aria-label]="label()"
      (close)="open.set(false)"
      (click)="$event.target === dialog && !wasDragged() && open.set(false)"
      (pointerdown)="startDrag($event)"
      (pointermove)="moveDrag($event)"
      (pointerup)="endDrag()"
      (pointercancel)="endDrag()"
      (wheel)="$event.deltaY > 0 && expandFromPartial()"
    >
      <div class="exp-bottom-sheet-handle-strip">
        <button
          type="button"
          class="exp-bottom-sheet-handle"
          [attr.aria-label]="handleLabel()"
          (click)="!wasDragged() && toggle()"
        ></button>
      </div>
      <div class="exp-bottom-sheet-content"><ng-content /></div>
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpBottomSheet {
  public readonly open: ModelSignal<boolean> = model(false);
  public readonly label: InputSignal<string | undefined> = input<string>();
  public readonly handleLabel: InputSignal<string> = input('Drag handle');

  private readonly dialog: Signal<ElementRef<HTMLDialogElement>> = viewChild.required('dialog');
  private offset: number = 0;
  private drag: Drag | null = null;
  private dragged: boolean = false;

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) {
        dialog.showModal();
        this.moveTo(this.anchors().partial ?? 0);
      } else if (!this.open() && dialog.open) {
        dialog.close();
      }
    });
  }

  protected toggle(): void {
    if (this.isPartial()) {
      this.moveTo(0);
    } else {
      this.open.set(false);
    }
  }

  protected expandFromPartial(): void {
    if (this.isPartial()) {
      this.moveTo(0);
    }
  }

  protected wasDragged(): boolean {
    const dragged = this.dragged;
    this.dragged = false;
    return dragged;
  }

  protected startDrag(event: PointerEvent): void {
    const onStrip = (event.target as Element).closest('.exp-bottom-sheet-handle-strip') !== null;
    if (event.button !== 0 || (!onStrip && !this.isPartial())) {
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
    };
  }

  protected moveDrag(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    if (!drag.dragging) {
      if (Math.abs(event.clientY - drag.startY) < dragSlop) {
        return;
      }
      drag.dragging = true;
      this.dialog().nativeElement.setPointerCapture(event.pointerId);
      this.dialog().nativeElement.classList.add('exp-bottom-sheet-dragging');
    }
    const elapsed = event.timeStamp - drag.lastTime;
    if (elapsed > 0) {
      drag.velocity = (event.clientY - drag.lastY) / elapsed;
    }
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;
    this.moveTo(Math.min(Math.max(drag.startOffset + event.clientY - drag.startY, 0), this.anchors().hidden));
  }

  protected endDrag(): void {
    const drag = this.drag;
    this.drag = null;
    if (!drag?.dragging) {
      return;
    }
    this.dragged = true;
    this.dialog().nativeElement.classList.remove('exp-bottom-sheet-dragging');
    const { partial, hidden } = this.anchors();
    const anchors = partial === null ? [0, hidden] : [0, partial, hidden];
    const target = settle(anchors, drag.startOffset, this.offset, drag.velocity);
    if (target === hidden) {
      this.open.set(false);
    } else {
      this.moveTo(target);
    }
  }

  private anchors(): { partial: number | null; hidden: number } {
    const height = this.dialog().nativeElement.offsetHeight;
    const half = window.innerHeight / 2;
    return { partial: height > half ? height - half : null, hidden: height };
  }

  private isPartial(): boolean {
    return this.offset > 0 && this.offset === this.anchors().partial;
  }

  private moveTo(offset: number): void {
    this.offset = offset;
    const dialog = this.dialog().nativeElement;
    dialog.style.setProperty('--exp-bottom-sheet-offset', `${offset}px`);
    dialog.classList.toggle('exp-bottom-sheet-partial', this.isPartial());
  }
}
