import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpModalNavigationRail } from './modal-navigation-rail';

@Component({
  imports: [ExpModalNavigationRail],
  template: `
    <exp-modal-navigation-rail [(open)]="open" label="Main">
      <a href="#">Home</a>
    </exp-modal-navigation-rail>
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

describe('ExpModalNavigationRail', () => {
  // jsdom has no showModal or close.
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement): void {
      this.open = true;
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement): void {
      this.open = false;
    };
  });

  it('shows the rail as a modal dialog while open, and closes it again', async () => {
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
    ['the scrim', true],
    ['an item', false],
  ])('closes on a click on %s: %s', async (_, closes) => {
    const { fixture, dialog } = await render();
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();

    const target = closes ? dialog : (dialog.querySelector('a') as HTMLElement);
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(fixture.componentInstance.open()).toBe(!closes);
  });
});
