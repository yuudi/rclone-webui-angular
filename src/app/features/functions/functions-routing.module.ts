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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FunctionsRoutingModule {}
