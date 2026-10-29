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
});
