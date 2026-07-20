import { Routes } from '@angular/router';
import { FunctionsComponent } from './functions.component';
import { isElectronGuard } from './is-electron.guard';

export const FUNCTIONS_ROUTES: Routes = [
  { path: '', component: FunctionsComponent, pathMatch: 'full' },
  {
    path: 'drive',
    loadChildren: () =>
      import('./backend/backend.routes').then((m) => m.BACKEND_ROUTES),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('./explorer/explorer.component').then((m) => m.ExplorerComponent),
  },
  {
    path: 'mount',
    loadComponent: () =>
      import('./mount/mount.component').then((m) => m.MountComponent),
  },
  {
    path: 'job',
    loadComponent: () =>
      import('./job/job.component').then((m) => m.JobComponent),
  },
  {
    path: 'cron',
    loadComponent: () =>
      import('./cron/cron.component').then((m) => m.CronComponent),
    canActivate: [isElectronGuard],
  },
];
