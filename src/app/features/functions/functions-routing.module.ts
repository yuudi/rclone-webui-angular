import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FunctionsComponent } from './functions.component';
import { isElectronGuard } from './is-electron.guard';

const routes: Routes = [
  { path: '', component: FunctionsComponent, pathMatch: 'full' },
  {
    path: 'drive',
    loadChildren: () =>
      import('./backend/backend.module').then((m) => m.BackendModule),
  },
  {
    path: 'explore',
    loadChildren: () =>
      import('./explorer/explorer.module').then((m) => m.ExplorerModule),
  },
  {
    path: 'mount',
    loadChildren: () =>
      import('./mount/mount.module').then((m) => m.MountModule),
  },
  {
    path: 'job',
    loadChildren: () => import('./job/job.module').then((m) => m.JobModule),
  },
  // {
  //   path: 'cron',
  //   loadChildren: () => import('./cron/cron.module').then((m) => m.CronModule),
  //   canActivate: [isElectronGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FunctionsRoutingModule {}
