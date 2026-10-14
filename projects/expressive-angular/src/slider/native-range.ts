import { DestroyRef } from '@angular/core';

/** What the drawing needs from a native range input. */
export interface RangeReading {
  min: number;
  max: number;
  value: number;
  /** Where the value sits between the minimum and the maximum, 0–1. */
  fraction: number;
  /** Positions of the steps, 0–1, first and last included; empty for a continuous input. */
  ticks: number[];
  disabled: boolean;
}

export function readRange(input: HTMLInputElement): RangeReading {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value);
  const range = max - min;
  const fraction = range > 0 ? Math.min(Math.max((value - min) / range, 0), 1) : 0;
  const step = Number(input.getAttribute('step'));
  const count = step > 0 ? Math.round(range / step) : 0;
  const ticks = count > 1 ? Array.from({ length: count + 1 }, (_, i) => i / count) : [];
  return { min, max, value, fraction, ticks, disabled: input.disabled };
}

/**
 * Makes an input without a `step` attribute continuous. Must run before the input's own bindings and form directives,
 * so their first value is not rounded to the native default step of 1; a value written in the template was rounded
 * when the element was created, so it is set again.
 */
export function makeContinuous(input: HTMLInputElement): void {
  if (input.hasAttribute('step')) return;
  input.step = 'any';
  const initial = input.getAttribute('value');
  if (initial !== null) input.value = initial;
}

/** Calls `changed` whenever the input's value, limits or disabled state change. */
export function watchRange(input: HTMLInputElement, changed: () => void, destroyRef: DestroyRef): void {
  // Forms and bindings set `value` without an event, so the slider hears about it through the property.
  const value = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  Object.defineProperty(input, 'value', {
    configurable: true,
    get: () => value?.get?.call(input) as string,
    set: (next: string) => {
      value?.set?.call(input, next);
      changed();
    },
  });
  input.addEventListener('input', changed);
  const attributes = new MutationObserver(changed);
  attributes.observe(input, { attributes: true, attributeFilter: ['min', 'max', 'step', 'disabled'] });
  destroyRef.onDestroy(() => attributes.disconnect());
}

/**
 * Where a key moves the value, kept between `lower` and `upper`, or undefined for other keys. Compose moves a
 * continuous slider by 1 % of its range per key and a stepped one by a step; Page Up and Page Down move by a tenth of
 * the steps, at least one and at most ten.
 */
export function valueForKey(
  key: string,
  reading: RangeReading,
  rtl: boolean,
  lower: number,
  upper: number
): number | undefined {
  const { min, max, value, ticks } = reading;
  const steps = ticks.length > 0 ? ticks.length - 1 : 100;
  const delta = (max - min) / steps;
  const page = Math.min(Math.max(Math.floor(steps / 10), 1), 10) * delta;
  const forward = rtl ? -1 : 1;
  const next = {
    ArrowRight: value + forward * delta,
    ArrowLeft: value - forward * delta,
    ArrowUp: value + delta,
    ArrowDown: value - delta,
    PageUp: value + page,
    PageDown: value - page,
    Home: min,
    End: max,
  }[key];
  return next === undefined ? undefined : Math.min(Math.max(next, lower), upper);
}

/** Sets the value as the user would, so forms and listeners hear about it. */
export function commit(input: HTMLInputElement, value: number, events: ('input' | 'change')[]): void {
  input.value = `${value}`;
  for (const type of events) input.dispatchEvent(new Event(type, { bubbles: true }));
}
