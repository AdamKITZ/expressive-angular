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
