import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ExpFloatingToolbar, ExpFloatingToolbarOrientation } from './floating-toolbar';

@Component({
  imports: [ExpFloatingToolbar],
  template: `
    <exp-floating-toolbar aria-label="Editor" [orientation]="orientation()" [expanded]="expanded()">
      <button expToolbarLeading>back</button>
      <button>bold</button>
      <button disabled>italic</button>
      <button>link</button>
      <button expToolbarTrailing>more</button>
    </exp-floating-toolbar>
  `,
})
class Host {
  public readonly orientation = signal<ExpFloatingToolbarOrientation>('horizontal');
  public readonly expanded = signal(true);
}

async function setup(orientation: ExpFloatingToolbarOrientation = 'horizontal'): Promise<{
  host: Host;
  element: HTMLElement;
  button: (label: string) => HTMLButtonElement;
  press: (key: string) => Promise<void>;
  stable: () => Promise<void>;
}> {
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.orientation.set(orientation);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  const button = (label: string): HTMLButtonElement =>
    [...element.querySelectorAll('button')].find((b) => b.textContent?.trim() === label)!;
  const press = async (key: string): Promise<void> => {
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    await fixture.whenStable();
  };
  return { host: fixture.componentInstance, element, button, press, stable: () => fixture.whenStable() };
}

describe('ExpFloatingToolbar', () => {
  it.each([
    { orientation: 'horizontal' as const, next: 'ArrowRight', previous: 'ArrowLeft' },
    { orientation: 'vertical' as const, next: 'ArrowDown', previous: 'ArrowUp' },
  ])('moves focus with $next and $previous, skipping disabled items and wrapping', async (keys) => {
    const { button, press } = await setup(keys.orientation);
    button('bold').focus();

    await press(keys.next);
    expect(document.activeElement).toBe(button('link'));
    await press(keys.next);
    await press(keys.next);
    expect(document.activeElement).toBe(button('back'));
    await press(keys.previous);
    expect(document.activeElement).toBe(button('more'));
  });

  it('moves focus to the first and last item with Home and End', async () => {
    const { button, press } = await setup();
    button('link').focus();

    await press('Home');
    expect(document.activeElement).toBe(button('back'));
    await press('End');
    expect(document.activeElement).toBe(button('more'));
  });

  it('keeps one tab stop, on the item focused last', async () => {
    const { button, press } = await setup();
    expect(['back', 'bold', 'link', 'more'].map((label) => button(label).tabIndex)).toEqual([0, -1, -1, -1]);

    button('bold').focus();
    await press('ArrowRight');
    expect(['back', 'bold', 'link', 'more'].map((label) => button(label).tabIndex)).toEqual([-1, -1, 0, -1]);
  });

  it('names the toolbar with the aria-label set on the component', async () => {
    const { element } = await setup();

    expect(element.querySelector('[role=toolbar]')?.getAttribute('aria-label')).toBe('Editor');
    expect(element.querySelector('exp-floating-toolbar')?.hasAttribute('aria-label')).toBe(false);
  });

  it('leaves folded items out and moves the tab stop off them when collapsing', async () => {
    const { host, button, press, stable } = await setup();
    host.expanded.set(false);
    await stable();

    expect(button('bold').tabIndex).toBe(0);
    button('link').focus();
    await press('ArrowRight');
    expect(document.activeElement).toBe(button('bold'));
  });
});
