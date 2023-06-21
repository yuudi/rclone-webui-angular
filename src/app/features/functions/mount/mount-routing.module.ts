import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MountComponent } from './mount.component';

const routes: Routes = [
  {
    path: '',
    component: MountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MountRoutingModule {}
