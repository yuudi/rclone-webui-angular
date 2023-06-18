import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewBackendComponent } from './new-backend.component';

const routes: Routes = [{ path: '', component: NewBackendComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewBackendRoutingModule {}
