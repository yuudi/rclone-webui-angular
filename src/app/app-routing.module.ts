import { NgModule } from '@angular/core';
import {
  NoPreloading,
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router';

import { environment } from 'src/environments/environment';
import { connectionGuard } from './cores/remote-control/connection.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [connectionGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'connection',
    loadChildren: () =>
      import('./features/connection/connection.module').then(
        (m) => m.ConnectionModule
      ),
  },
  {
    path: 'rclone',
    canActivate: [connectionGuard],
    loadChildren: () =>
      import('./features/functions/functions.module').then(
        (m) => m.FunctionsModule
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./cores/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: environment.prefetch
        ? PreloadAllModules
        : NoPreloading,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
