import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpSearch } from './search';

@Component({
  imports: [ExpSearch],
  template: `
    <exp-search [(query)]="query" [(expanded)]="expanded" placeholder="Search" (searched)="searched = $event">
      <a href="#">Result</a>
    </exp-search>
  `,
})
class Host {
  public readonly query: WritableSignal<string> = signal('');
  public readonly expanded: WritableSignal<boolean> = signal(false);
  public searched: string | undefined;
}

interface Rendered {
  fixture: ComponentFixture<Host>;
  bar: HTMLButtonElement;
  dialog: HTMLDialogElement;
  input: HTMLInputElement;
}

async function render(): Promise<Rendered> {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  return {
    fixture,
    bar: element.querySelector('button.exp-search-bar') as HTMLButtonElement,
    dialog: element.querySelector('dialog') as HTMLDialogElement,
    input: element.querySelector('dialog input') as HTMLInputElement,
  };
}

describe('ExpSearch', () => {
  // jsdom has no showModal or close.
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement): void {
      this.open = true;
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement): void {
      this.open = false;
    };
  });

  it('expands into a modal dialog when the bar is clicked', async () => {
    const { fixture, bar, dialog } = await render();

    bar.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.expanded()).toBe(true);
    expect(dialog.open).toBe(true);
  });

  it('shows the query on the bar and in the field, and takes what is typed', async () => {
    const { fixture, bar, input } = await render();
    fixture.componentInstance.query.set('slider');
    await fixture.whenStable();
    expect(bar.textContent).toContain('slider');
    expect(input.value).toBe('slider');

    input.value = 'menu';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.query()).toBe('menu');
  });

  it('emits the query on Enter', async () => {
    const { fixture, input } = await render();
    fixture.componentInstance.query.set('rail');
    await fixture.whenStable();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(fixture.componentInstance.searched).toBe('rail');
  });

  it.each([
    ['the scrim', true],
    ['a result', false],
  ])('collapses on a click on %s: %s', async (_, collapses) => {
    const { fixture, dialog } = await render();
    fixture.componentInstance.expanded.set(true);
    await fixture.whenStable();

    const target = collapses ? dialog : (dialog.querySelector('a') as HTMLElement);
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(fixture.componentInstance.expanded()).toBe(!collapses);
  });

  it('collapses when the dialog closes itself, as on Escape', async () => {
    const { fixture, dialog } = await render();
    fixture.componentInstance.expanded.set(true);
    await fixture.whenStable();

    dialog.close();
    dialog.dispatchEvent(new Event('close'));

    expect(fixture.componentInstance.expanded()).toBe(false);
  });
});
