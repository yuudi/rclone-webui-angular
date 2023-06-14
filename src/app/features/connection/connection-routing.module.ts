import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConnectionComponent } from './connection.component';
import { NewConnectionComponent } from './new-connection/new-connection.component';

const routes: Routes = [
  {
    path: '',
    component: ConnectionComponent,
    pathMatch: 'full',
  },
  {
    path: 'new',
    component: NewConnectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionRoutingModule {}
