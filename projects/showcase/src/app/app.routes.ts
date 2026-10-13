import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./playground/playground').then((m) => m.Playground),
  },
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
    path: 'reference/icon-button-colors',
    loadComponent: () => import('./reference/icon-button-colors').then((m) => m.IconButtonColorsReference),
  },
  {
    path: 'reference/icon-button-sizes',
    loadComponent: () => import('./reference/icon-button-sizes').then((m) => m.IconButtonSizesReference),
  },
  {
    path: 'reference/split-button',
    loadComponent: () => import('./reference/split-button').then((m) => m.SplitButtonReference),
  },
  {
    path: 'reference/split-button-sizes',
    loadComponent: () => import('./reference/split-button-sizes').then((m) => m.SplitButtonSizesReference),
  },
];
