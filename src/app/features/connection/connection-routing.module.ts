import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewConnectionComponent } from './new-connection/new-connection.component';

const routes: Routes = [
  {
    path: '',
    component: NewConnectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionRoutingModule {}
