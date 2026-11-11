import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ExpShape } from './exp-shape';
import { ExpShapeName, expShapePath } from './shape';

@Component({
  imports: [ExpShape],
  template: `<exp-shape [shape]="shape()" />`,
})
class Host {
  public readonly shape = signal<ExpShapeName>('circle');
}

describe('ExpShape', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('draws the new shape at once when the user prefers reduced motion', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const path = (): string | null =>
      (fixture.nativeElement as HTMLElement).querySelector('path')?.getAttribute('d') ?? null;
    expect(path()).toBe(expShapePath('circle'));

    fixture.componentInstance.shape.set('heart');
    await fixture.whenStable();

    expect(path()).toBe(expShapePath('heart'));
  });
});
