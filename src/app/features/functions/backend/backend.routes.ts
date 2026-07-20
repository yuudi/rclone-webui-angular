import { Routes } from '@angular/router';
import { BackendComponent } from './backend.component';

export const BACKEND_ROUTES: Routes = [
  { path: '', component: BackendComponent },
  {
    path: 'new',
    loadComponent: () =>
      import('./new-backend/new-backend.component').then(
        (m) => m.NewBackendComponent,
      ),
  },
];
