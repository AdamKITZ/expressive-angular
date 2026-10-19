import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

import { ExpMenuGroup } from './menu-group';

@Component({
  imports: [MatMenu, MatMenuItem, MatMenuTrigger, ExpMenuGroup],
  template: `
    <button [matMenuTriggerFor]="menu">Open</button>
    <mat-menu #menu="matMenu">
      <exp-menu-group label="Survey">
        <button mat-menu-item>Create</button>
        <button mat-menu-item>Edit</button>
      </exp-menu-group>
      <exp-menu-group>
        <button mat-menu-item>Translate</button>
      </exp-menu-group>
    </mat-menu>
  `,
})
class Host {}

async function openMenu(): Promise<{ fixture: ComponentFixture<Host>; items: HTMLElement[] }> {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
  await fixture.whenStable();
  const items = Array.from(document.querySelectorAll<HTMLElement>('.mat-mdc-menu-item'));
  return { fixture, items };
}

describe('ExpMenuGroup', () => {
  it('names the group after its label', async () => {
    await openMenu();

    const group = document.querySelector('exp-menu-group');
    expect(group?.getAttribute('role')).toBe('group');
    expect(group?.getAttribute('aria-label')).toBe('Survey');
  });

  it('lets the arrow keys move from the last item of one group into the next', async () => {
    const { fixture, items } = await openMenu();
    const panel = document.querySelector<HTMLElement>('.mat-mdc-menu-panel');

    // Opening focuses the first item, so the second press leaves the first group.
    panel?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true }));
    panel?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true }));
    await fixture.whenStable();

    expect(document.activeElement).toBe(items[2]);
  });
});
