import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpBottomSheet } from './bottom-sheet';

@Component({
  imports: [ExpBottomSheet],
  template: `
    <exp-bottom-sheet [(open)]="open" label="Share">
      <button type="button">Copy link</button>
    </exp-bottom-sheet>
  `,
})
class Host {
  public readonly open: WritableSignal<boolean> = signal(false);
}

async function render(): Promise<{ fixture: ComponentFixture<Host>; dialog: HTMLDialogElement }> {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const dialog = (fixture.nativeElement as HTMLElement).querySelector('dialog') as HTMLDialogElement;
  return { fixture, dialog };
}

describe('ExpBottomSheet', () => {
  // jsdom has no showModal or close.
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement): void {
      this.open = true;
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement): void {
      this.open = false;
    };
  });

  async function pullContent(pointerType: string, scrollTop: number, distance: number): Promise<boolean> {
    const { fixture, dialog } = await render();
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    Object.defineProperty(dialog, 'offsetHeight', { value: 300 });
    dialog.setPointerCapture = (): void => undefined;
    const content = dialog.querySelector('.exp-bottom-sheet-content') as HTMLElement;
    content.scrollTop = scrollTop;
    const button = content.querySelector('button') as HTMLElement;
    const pointer = { bubbles: true, pointerId: 1, pointerType, button: 0 };

    button.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, clientY: 400 }));
    button.dispatchEvent(new PointerEvent('pointermove', { ...pointer, clientY: 400 + distance }));
    button.dispatchEvent(new PointerEvent('pointerup', { ...pointer, clientY: 400 + distance }));
    return fixture.componentInstance.open();
  }

  it.each(['touch', 'mouse'])(
    'closes on a %s pulling the content down while it is scrolled to the top',
    async (pointerType) => {
      expect(await pullContent(pointerType, 0, 250)).toBe(false);
    }
  );

  it.each([
    ['the content is scrolled down', 'touch', 40, 250],
    ['the touch moves up', 'touch', 0, -250],
  ])('keeps the sheet open when %s', async (_, pointerType, scrollTop, distance) => {
    expect(await pullContent(pointerType, scrollTop, distance)).toBe(true);
  });

  it('shows the sheet as a modal dialog while open, and closes it again', async () => {
    const { fixture, dialog } = await render();
    expect(dialog.open).toBe(false);

    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    expect(dialog.open).toBe(true);

    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
  });

  it('reports open false when the dialog closes itself, as on Escape', async () => {
    const { fixture, dialog } = await render();
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();

    dialog.close();
    dialog.dispatchEvent(new Event('close'));

    expect(fixture.componentInstance.open()).toBe(false);
  });

  it.each([
    ['a click on the scrim', (dialog: HTMLDialogElement): HTMLElement => dialog],
    [
      'a click on the drag handle of a fully open sheet',
      (dialog: HTMLDialogElement): HTMLElement => dialog.querySelector('.exp-bottom-sheet-handle') as HTMLElement,
    ],
  ])('closes on %s', async (_, target) => {
    const { fixture, dialog } = await render();
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();

    target(dialog).click();

    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('stays open on a click inside the sheet', async () => {
    const { fixture, dialog } = await render();
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();

    (dialog.querySelector('button:not(.exp-bottom-sheet-handle)') as HTMLElement).click();

    expect(fixture.componentInstance.open()).toBe(true);
  });
});
