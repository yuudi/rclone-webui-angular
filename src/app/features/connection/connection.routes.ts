import { Routes } from '@angular/router';
import { ConnectionComponent } from './connection.component';
import { ConnectionEditorComponent } from './connection-editor/connection-editor.component';

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
