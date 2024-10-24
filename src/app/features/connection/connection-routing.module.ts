import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConnectionEditorComponent } from './connection-editor/connection-editor.component';
import { ConnectionComponent } from './connection.component';

const routes: Routes = [
  {
    path: '',
    component: ConnectionComponent,
    pathMatch: 'full',
  },
  {
    path: 'new',
    component: ConnectionEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionRoutingModule {}
