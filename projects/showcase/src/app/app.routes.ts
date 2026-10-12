import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reference/button',
    loadComponent: () => import('./reference/button').then((m) => m.ButtonReference),
  },
  {
    path: 'reference/button-group',
    loadComponent: () => import('./reference/button-group').then((m) => m.ButtonGroupReference),
  },
  {
    path: 'reference/corner-large-increased',
    loadComponent: () => import('./reference/corner-large-increased').then((m) => m.CornerLargeIncreased),
  },
  {
    path: 'reference/loading-indicator',
    loadComponent: () => import('./reference/loading-indicator').then((m) => m.LoadingIndicatorReference),
  },
  {
    path: 'reference/icon-button',
    loadComponent: () => import('./reference/icon-button').then((m) => m.IconButtonReference),
  },
];
