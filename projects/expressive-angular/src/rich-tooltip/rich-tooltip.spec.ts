import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpRichTooltip, ExpRichTooltipActions, ExpRichTooltipSubhead, ExpRichTooltipTrigger } from './rich-tooltip';

@Component({
  imports: [ExpRichTooltip, ExpRichTooltipSubhead, ExpRichTooltipActions, ExpRichTooltipTrigger],
  template: `
    <button [expRichTooltipTriggerFor]="tip">anchor</button>
    <button>elsewhere</button>
    <exp-rich-tooltip #tip>
      <span expRichTooltipSubhead>Retention</span>
      Responses are deleted after <strong>90 days</strong>.
      @if (withActions()) {
        <div expRichTooltipActions><button>Settings</button></div>
      }
    </exp-rich-tooltip>
  `,
})
class Host {
  public readonly withActions = signal(false);
}

interface Setup {
  fixture: ComponentFixture<Host>;
  anchor: HTMLButtonElement;
  tooltip: () => HTMLElement | null;
  pointer: (target: Element, type: string, pointerType?: string) => Promise<void>;
  wait: (ms: number) => Promise<void>;
}

async function setup(withActions = false): Promise<Setup> {
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.withActions.set(withActions);
  await fixture.whenStable();
  vi.useFakeTimers();
  const anchor = (fixture.nativeElement as HTMLElement).querySelector('button')!;
  const wait = async (ms: number): Promise<void> => {
    await vi.advanceTimersByTimeAsync(ms);
    fixture.detectChanges();
  };
  return {
    fixture,
    anchor,
    tooltip: () => document.querySelector('.exp-rich-tooltip'),
    pointer: async (target, type, pointerType = 'mouse') => {
      target.dispatchEvent(new PointerEvent(type, { pointerType, bubbles: true }));
      await wait(0);
    },
    wait,
  };
}

describe('ExpRichTooltip', () => {
  afterEach(() => vi.useRealTimers());

  it('shows on mouse hover and hides once the pointer has left', async () => {
    const { anchor, tooltip, pointer, wait } = await setup();

    await pointer(anchor, 'pointerenter');
    expect(tooltip()?.textContent).toContain('90 days');

    await pointer(anchor, 'pointerleave');
    await wait(500);
    expect(tooltip()).toBeNull();
  });

  it('stays open while the pointer moves from the anchor into the tooltip', async () => {
    const { anchor, tooltip, pointer, wait } = await setup();
    await pointer(anchor, 'pointerenter');

    await pointer(anchor, 'pointerleave');
    await pointer(tooltip()!, 'pointerenter');
    await wait(500);
    expect(tooltip()).not.toBeNull();

    await pointer(tooltip()!, 'pointerleave');
    await wait(500);
    expect(tooltip()).toBeNull();
  });

  it('shows on keyboard focus and hides on Escape', async () => {
    const { anchor, tooltip, wait } = await setup();

    TestBed.inject(FocusMonitor).focusVia(anchor, 'keyboard');
    await wait(0);
    expect(tooltip()).not.toBeNull();

    anchor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await wait(500);
    expect(tooltip()).toBeNull();
  });

  it('stays open after keyboard focus when a pointer leaves it', async () => {
    const { anchor, tooltip, pointer, wait } = await setup();
    TestBed.inject(FocusMonitor).focusVia(anchor, 'keyboard');
    await wait(0);

    await pointer(tooltip()!, 'pointerleave');
    await wait(500);
    expect(tooltip()).not.toBeNull();
  });

  it('does not show when the anchor is focused by a click', async () => {
    const { anchor, tooltip, wait } = await setup();

    TestBed.inject(FocusMonitor).focusVia(anchor, 'mouse');
    await wait(0);
    expect(tooltip()).toBeNull();
  });

  it('shows on a touch long press and hides by itself after 1.5 s', async () => {
    const { anchor, tooltip, pointer, wait } = await setup();

    await pointer(anchor, 'pointerdown', 'touch');
    await wait(500);
    await pointer(anchor, 'pointerup', 'touch');
    expect(tooltip()).not.toBeNull();

    await wait(1500);
    expect(tooltip()).toBeNull();
  });

  it('describes the anchor with a plain tooltip', async () => {
    const { anchor, tooltip, pointer } = await setup();
    await pointer(anchor, 'pointerenter');

    expect(tooltip()?.getAttribute('role')).toBe('tooltip');
    expect(anchor.getAttribute('aria-describedby')).toBe(tooltip()?.id);
    expect(anchor.hasAttribute('aria-expanded')).toBe(false);
  });

  describe('with actions', () => {
    it('stays open when the pointer leaves and closes on a click outside', async () => {
      const { anchor, tooltip, pointer, wait } = await setup(true);
      await pointer(anchor, 'pointerenter');

      await pointer(anchor, 'pointerleave');
      await wait(500);
      expect(tooltip()).not.toBeNull();

      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await wait(500);
      expect(tooltip()).toBeNull();
    });

    it('opens and closes with a click on the anchor', async () => {
      const { anchor, tooltip, wait } = await setup(true);

      anchor.click();
      await wait(0);
      expect(tooltip()).not.toBeNull();

      anchor.click();
      await wait(500);
      expect(tooltip()).toBeNull();
    });

    it('closes on Escape from inside and gives focus back to the anchor', async () => {
      const { anchor, tooltip, wait } = await setup(true);
      anchor.click();
      await wait(0);
      const action = tooltip()!.querySelector('button')!;
      action.focus();

      action.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await wait(500);
      expect(tooltip()).toBeNull();
      expect(document.activeElement).toBe(anchor);
    });

    it('is a dialog named by its subhead that the anchor expands', async () => {
      const { anchor, tooltip, wait } = await setup(true);
      expect(anchor.getAttribute('aria-expanded')).toBe('false');

      anchor.click();
      await wait(0);
      const subhead = tooltip()!.querySelector('[expRichTooltipSubhead]')!;
      expect(tooltip()?.getAttribute('role')).toBe('dialog');
      expect(tooltip()?.getAttribute('aria-labelledby')).toBe(subhead.id);
      expect(anchor.getAttribute('aria-expanded')).toBe('true');
      expect(anchor.getAttribute('aria-controls')).toBe(tooltip()?.id);
      expect(anchor.hasAttribute('aria-describedby')).toBe(false);
    });
  });
});
