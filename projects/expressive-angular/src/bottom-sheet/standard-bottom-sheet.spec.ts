import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpStandardBottomSheet } from './standard-bottom-sheet';

@Component({
  imports: [ExpStandardBottomSheet],
  template: `
    <exp-standard-bottom-sheet [(expanded)]="expanded">
      <p>Nearby places</p>
    </exp-standard-bottom-sheet>
  `,
})
class Host {
  public readonly expanded: WritableSignal<boolean> = signal(false);
}

@Component({
  imports: [ExpStandardBottomSheet],
  template: `
    <exp-standard-bottom-sheet [(expanded)]="expanded" [(middle)]="middle" [middleHeight]="300">
      <p>Nearby places</p>
    </exp-standard-bottom-sheet>
  `,
})
class MiddleHost {
  public readonly expanded: WritableSignal<boolean> = signal(false);
  public readonly middle: WritableSignal<boolean> = signal(false);
}

function pull(sheet: HTMLElement, from: number, to: number): void {
  const strip = sheet.querySelector('.exp-bottom-sheet-handle-strip') as HTMLElement;
  const pointer = { bubbles: true, pointerId: 1, pointerType: 'mouse', button: 0 };
  strip.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, clientY: from }));
  strip.dispatchEvent(new PointerEvent('pointermove', { ...pointer, clientY: to }));
  strip.dispatchEvent(new PointerEvent('pointerup', { ...pointer, clientY: to }));
}

describe('ExpStandardBottomSheet', () => {
  it('opens fully and folds back to its peek height on a click on the drag handle', async () => {
    const fixture: ComponentFixture<Host> = TestBed.createComponent(Host);
    await fixture.whenStable();
    const handle = (fixture.nativeElement as HTMLElement).querySelector('.exp-bottom-sheet-handle') as HTMLElement;
    expect(handle.getAttribute('aria-expanded')).toBe('false');

    handle.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(true);
    expect(handle.getAttribute('aria-expanded')).toBe('true');

    handle.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.expanded()).toBe(false);
  });

  it.each([
    ['folds on a pull down on its content scrolled to the top', 0, false],
    ['stays open on a pull down on its content scrolled down', 40, true],
  ])('%s', async (_, scrollTop, expanded) => {
    const fixture: ComponentFixture<Host> = TestBed.createComponent(Host);
    fixture.componentInstance.expanded.set(true);
    await fixture.whenStable();
    const sheet = (fixture.nativeElement as HTMLElement).querySelector('.exp-standard-bottom-sheet') as HTMLElement;
    Object.defineProperty(sheet, 'offsetHeight', { value: 300 });
    sheet.setPointerCapture = (): void => undefined;
    const content = sheet.querySelector('.exp-bottom-sheet-content') as HTMLElement;
    content.scrollTop = scrollTop;
    const text = content.querySelector('p') as HTMLElement;
    const pointer = { bubbles: true, pointerId: 1, pointerType: 'mouse', button: 0 };

    text.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, clientY: 400 }));
    text.dispatchEvent(new PointerEvent('pointermove', { ...pointer, clientY: 650 }));
    text.dispatchEvent(new PointerEvent('pointerup', { ...pointer, clientY: 650 }));

    expect(fixture.componentInstance.expanded()).toBe(expanded);
  });

  describe('with a middle height', () => {
    async function setUp(): Promise<{ fixture: ComponentFixture<MiddleHost>; sheet: HTMLElement }> {
      const fixture: ComponentFixture<MiddleHost> = TestBed.createComponent(MiddleHost);
      const sheet = (fixture.nativeElement as HTMLElement).querySelector('.exp-standard-bottom-sheet') as HTMLElement;
      Object.defineProperty(sheet, 'offsetHeight', { value: 600 });
      sheet.setPointerCapture = (): void => undefined;
      await fixture.whenStable();
      return { fixture, sheet };
    }

    it('goes from its peek to the middle, to fully open and back on clicks on the drag handle', async () => {
      const { fixture, sheet } = await setUp();
      const handle = sheet.querySelector('.exp-bottom-sheet-handle') as HTMLElement;
      const state = (): [boolean, boolean] => [
        fixture.componentInstance.middle(),
        fixture.componentInstance.expanded(),
      ];

      handle.click();
      await fixture.whenStable();
      expect(state()).toEqual([true, false]);
      handle.click();
      await fixture.whenStable();
      expect(state()).toEqual([false, true]);
      handle.click();
      await fixture.whenStable();
      expect(state()).toEqual([false, false]);
    });

    it('stops at the middle on a pull down from fully open', async () => {
      const { fixture, sheet } = await setUp();
      fixture.componentInstance.expanded.set(true);
      await fixture.whenStable();

      pull(sheet, 100, 350);

      expect(fixture.componentInstance.expanded()).toBe(false);
      expect(fixture.componentInstance.middle()).toBe(true);
    });

    it('folds to its peek on a pull down from the middle', async () => {
      const { fixture, sheet } = await setUp();
      fixture.componentInstance.middle.set(true);
      await fixture.whenStable();

      pull(sheet, 300, 420);

      expect(fixture.componentInstance.middle()).toBe(false);
      expect(fixture.componentInstance.expanded()).toBe(false);
    });
  });
});
