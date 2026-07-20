import { Routes } from '@angular/router';
import { connectionGuard } from './cores/remote-control/connection.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [connectionGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'connection',
    loadChildren: () =>
      import('./features/connection/connection.routes').then(
        (m) => m.CONNECTION_ROUTES,
      ),
  },
  {
    path: 'rclone',
    canActivate: [connectionGuard],
    loadChildren: () =>
      import('./features/functions/functions.routes').then(
        (m) => m.FUNCTIONS_ROUTES,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./cores/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
