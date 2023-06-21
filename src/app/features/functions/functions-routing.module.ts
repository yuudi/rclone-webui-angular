import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FunctionsComponent } from './functions.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FunctionsRoutingModule {}
