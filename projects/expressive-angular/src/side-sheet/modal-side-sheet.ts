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

import { settleSide } from './settle-side';

/** How far a touch moves before the move counts as a swipe. */
const dragSlop = 8;

interface Drag {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  dragging: boolean;
}

/**
 * Material's modal side sheet (Material Components' `SideSheetDialog`): a sheet that slides in from the end edge over a
 * scrim while `open` is true, and that a swipe towards that edge closes. Lay out its header, content and actions
 * yourself. It runs in a native modal `<dialog>`, which traps focus and closes on Escape; a click on the scrim closes
 * it too. Needs the `side-sheet` Sass mixin once in the app's styles.
 */
@Component({
  selector: 'exp-modal-side-sheet',
  template: `
    <dialog
      #dialog
      class="exp-modal-side-sheet"
      [attr.aria-label]="label()"
      (close)="open.set(false)"
      (click)="$event.target === dialog && !wasDragged() && open.set(false)"
      (pointerdown)="startDrag($event)"
      (pointermove)="moveDrag($event)"
      (pointerup)="endDrag()"
      (pointercancel)="endDrag()"
    >
      <ng-content />
    </dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpModalSideSheet {
  public readonly open: ModelSignal<boolean> = model(false);
  public readonly label: InputSignal<string | undefined> = input<string>();

  private readonly dialog: Signal<ElementRef<HTMLDialogElement>> = viewChild.required('dialog');
  private drag: Drag | null = null;
  private dragged: boolean = false;

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) {
        this.moveTo(0);
        dialog.showModal();
      } else if (!this.open() && dialog.open) {
        dialog.close();
      }
    });
  }

  protected wasDragged(): boolean {
    const dragged = this.dragged;
    this.dragged = false;
    return dragged;
  }

  protected startDrag(event: PointerEvent): void {
    if (event.pointerType === 'mouse' || !event.isPrimary) {
      return;
    }
    this.drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
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
    const outwards = this.outwards();
    if (!drag.dragging) {
      const dx = (event.clientX - drag.startX) * outwards;
      if (Math.max(Math.abs(dx), Math.abs(event.clientY - drag.startY)) < dragSlop) {
        return;
      }
      if (Math.abs(dx) <= Math.abs(event.clientY - drag.startY)) {
        this.drag = null;
        return;
      }
      drag.dragging = true;
      this.dialog().nativeElement.setPointerCapture(event.pointerId);
      this.dialog().nativeElement.classList.add('exp-modal-side-sheet-dragging');
    }
    const elapsed = event.timeStamp - drag.lastTime;
    if (elapsed > 0) {
      drag.velocity = ((event.clientX - drag.lastX) * outwards) / elapsed;
    }
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    this.moveTo(Math.max((event.clientX - drag.startX) * outwards, 0));
  }

  protected endDrag(): void {
    const drag = this.drag;
    this.drag = null;
    if (!drag?.dragging) {
      return;
    }
    this.dragged = true;
    const dialog = this.dialog().nativeElement;
    dialog.classList.remove('exp-modal-side-sheet-dragging');
    const offset = Math.max((drag.lastX - drag.startX) * this.outwards(), 0);
    if (settleSide(offset, dialog.offsetWidth, drag.velocity)) {
      this.open.set(false);
    } else {
      this.moveTo(0);
    }
  }

  /** 1 when the sheet sits at the right edge, -1 at the left edge of a right-to-left page. */
  private outwards(): number {
    return getComputedStyle(this.dialog().nativeElement).direction === 'rtl' ? -1 : 1;
  }

  private moveTo(offset: number): void {
    this.dialog().nativeElement.style.setProperty('--exp-modal-side-sheet-offset', `${offset * this.outwards()}px`);
  }
}
