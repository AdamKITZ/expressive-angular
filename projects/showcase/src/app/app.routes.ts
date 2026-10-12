import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reference/corner-large-increased',
    loadComponent: () => import('./reference/corner-large-increased').then((m) => m.CornerLargeIncreased),
  },
  {
    path: 'reference/icon-button',
    loadComponent: () => import('./reference/icon-button').then((m) => m.IconButtonReference),
  },
];
