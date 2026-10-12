import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reference/corner-large-increased',
    loadComponent: () => import('./reference/corner-large-increased').then((m) => m.CornerLargeIncreased),
  },
];
