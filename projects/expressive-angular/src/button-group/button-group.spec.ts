import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

import { ExpButton } from '../button/button';
import { ExpButtonGroup } from './button-group';
import { durationMs } from './duration-ms';
import { pressedWidths } from './pressed-widths';

@Component({
  imports: [MatButton, ExpButton, ExpButtonGroup],
  template: `
    <exp-button-group aria-label="Score" [(value)]="value">
      @for (score of [1, 2, 3, 4]; track score) {
        <button matButton="tonal" expButton [value]="score" [disabled]="score === 3">{{ score }}</button>
      }
    </exp-button-group>
  `,
})
class Host {
  public readonly value = signal<unknown>(null);
}

async function setup(value: unknown): Promise<{ fixture: ComponentFixture<Host>; buttons: HTMLButtonElement[] }> {
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.value.set(value);
  await fixture.whenStable();
  const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));
  return { fixture, buttons };
}

describe('ExpButtonGroup', () => {
  it('selects the clicked button and announces it as the checked radio', async () => {
    const { fixture, buttons } = await setup(null);

    buttons[1].click();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe(2);
    expect(buttons.map((button) => button.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false', 'false']);
  });

  it('keeps the selection when the selected button is clicked again', async () => {
    const { fixture, buttons } = await setup(2);

    buttons[1].click();
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe(2);
  });

  it.each([
    { value: 2, tabStop: 1 },
    { value: null, tabStop: 0 },
  ])('makes only one button tabbable when the value is $value', async ({ value, tabStop }) => {
    const { buttons } = await setup(value);

    expect(buttons.map((button) => button.tabIndex)).toEqual(buttons.map((_, i) => (i === tabStop ? 0 : -1)));
  });

  it.each([
    { from: 2, key: 'ArrowRight', to: 4 },
    { from: 4, key: 'ArrowRight', to: 1 },
    { from: 1, key: 'ArrowLeft', to: 4 },
    { from: 4, key: 'ArrowUp', to: 2 },
    { from: 1, key: 'ArrowDown', to: 2 },
  ])('$key from $from focuses and selects $to, skipping disabled buttons', async ({ from, key, to }) => {
    const { fixture, buttons } = await setup(from);

    buttons[from - 1].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe(to);
    expect(document.activeElement).toBe(buttons[to - 1]);
  });
});

@Component({
  imports: [MatButton, ExpButton, ExpButtonGroup, ReactiveFormsModule],
  template: `
    <exp-button-group connected aria-label="Length" [formControl]="length">
      <button matButton="tonal" expButton value="short">Short</button>
      <button matButton="tonal" expButton value="long">Long</button>
    </exp-button-group>
  `,
})
class FormHost {
  public readonly length = new FormControl('short');
}

describe('ExpButtonGroup in a form', () => {
  it('shows the control value, writes the clicked button back and turns touched once focus leaves', async () => {
    const fixture = TestBed.createComponent(FormHost);
    await fixture.whenStable();
    const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));
    expect(buttons.map((button) => button.getAttribute('aria-checked'))).toEqual(['true', 'false']);

    buttons[1].click();
    buttons[1].dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance.length.value).toBe('long');
    expect(fixture.componentInstance.length.touched).toBe(true);
  });

  it('follows a value set on the control', async () => {
    const fixture = TestBed.createComponent(FormHost);
    await fixture.whenStable();

    fixture.componentInstance.length.setValue('long');
    await fixture.whenStable();

    const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));
    expect(buttons.map((button) => button.getAttribute('aria-checked'))).toEqual(['false', 'true']);
  });
});

describe('pressedWidths', () => {
  it.each([
    { name: 'first', index: 0, expected: [115, 85, 100] },
    { name: 'middle', index: 1, expected: [92.5, 115, 92.5] },
    { name: 'last', index: 2, expected: [100, 85, 115] },
  ])('grows the $name button by the ratio and takes the space from its neighbours', ({ index, expected }) => {
    expect(pressedWidths([100, 100, 100], index, 0.15)).toEqual(expected);
  });
});

describe('durationMs', () => {
  it.each([
    { value: '360ms', expected: 360 },
    { value: '.36s', expected: 360 },
  ])('turns $value into $expected milliseconds', ({ value, expected }) => {
    expect(durationMs(value)).toBe(expected);
  });
});
