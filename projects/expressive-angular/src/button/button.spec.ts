import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatButton } from '@angular/material/button';

import { ExpButton } from './button';

@Component({
  imports: [MatButton, ExpButton],
  template: `<button matButton="tonal" expButton [selected]="selected()">Monthly</button>`,
})
class Host {
  public readonly selected = signal<boolean | undefined>(undefined);
}

describe('ExpButton', () => {
  it.each([
    { selected: undefined, ariaPressed: null },
    { selected: false, ariaPressed: 'false' },
    { selected: true, ariaPressed: 'true' },
  ])('announces selected=$selected as aria-pressed=$ariaPressed', async ({ selected, ariaPressed }) => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.selected.set(selected);
    await fixture.whenStable();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    expect(button?.getAttribute('aria-pressed')).toBe(ariaPressed);
  });
});
