import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './cores/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
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
    loadChildren: () =>
      import('./features/functions/functions.module').then(
        (m) => m.FunctionsModule
      ),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
