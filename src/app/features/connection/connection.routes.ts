import { Routes } from '@angular/router';
import { ConnectionEditorComponent } from './connection-editor/connection-editor.component';
import { ConnectionComponent } from './connection.component';

export const CONNECTION_ROUTES: Routes = [
  {
    path: '',
    component: ConnectionComponent,
  },
  {
    path: 'new',
    component: ConnectionEditorComponent,
  },
];
