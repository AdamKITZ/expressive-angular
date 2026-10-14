import { TestBed } from '@angular/core/testing';

import { ExpLinearProgress } from './linear-progress';

describe('ExpLinearProgress', () => {
  it.each([
    { value: 40, valueNow: '40' },
    { value: 140, valueNow: '100' },
    { value: undefined, valueNow: null },
  ])('reports $value as aria-valuenow $valueNow', async ({ value, valueNow }) => {
    const fixture = TestBed.createComponent(ExpLinearProgress);
    fixture.componentRef.setInput('value', value);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-valuenow')).toBe(valueNow);
  });
});
