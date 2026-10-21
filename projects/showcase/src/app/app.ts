import { ExpSearch } from '@adam01230/expressive-angular';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import { Page, PAGES, Section } from './pages';

interface SearchResult extends Section {
  page: Page;
}

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIcon, ExpSearch],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly pages: readonly Page[] = PAGES;
  protected readonly query: WritableSignal<string> = signal('');
  protected readonly searchExpanded: WritableSignal<boolean> = signal(false);
  protected readonly results: Signal<readonly SearchResult[]> = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.pages.flatMap((page) =>
      page.sections
        .filter((section) => section.title.toLowerCase().includes(query))
        .map((section) => ({ ...section, page }))
    );
  });

  private readonly router: Router = inject(Router);

  protected readonly isReference: Signal<boolean> = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith('/reference/'))
    ),
    { initialValue: true }
  );
  protected readonly isPhone: Signal<boolean> = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 599.98px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false }
  );

  protected open(result: SearchResult): void {
    this.searchExpanded.set(false);
    void this.router.navigate(['/', result.page.path], { fragment: result.id });
  }
}
