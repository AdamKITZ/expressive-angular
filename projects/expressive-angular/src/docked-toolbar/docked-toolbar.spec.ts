import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ExpDockedToolbar } from './docked-toolbar';

@Component({
  imports: [ExpDockedToolbar],
  template: `
    <exp-docked-toolbar aria-label="Actions">
      <button>archive</button>
      <button>delete</button>
      <button>share</button>
    </exp-docked-toolbar>
  `,
})
class Host {}

async function setup(): Promise<{ element: HTMLElement; button: (label: string) => HTMLButtonElement }> {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  const button = (label: string): HTMLButtonElement =>
    [...element.querySelectorAll('button')].find((b) => b.textContent?.trim() === label)!;
  return { element, button };
}

describe('ExpDockedToolbar', () => {
  it('moves focus between items with the arrow keys', async () => {
    const { button } = await setup();
    button('archive').focus();

    button('archive').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(button('delete'));
    expect(button('share').tabIndex).toBe(-1);
  });

  it('names the toolbar with the aria-label set on the component', async () => {
    const { element } = await setup();

    expect(element.querySelector('[role=toolbar]')?.getAttribute('aria-label')).toBe('Actions');
    expect(element.querySelector('exp-docked-toolbar')?.hasAttribute('aria-label')).toBe(false);
  });
});
