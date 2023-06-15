import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ConnectionService, NotSaved } from './connection.service';

export const connectionGuard: CanActivateFn = () => {
  const connectionService = inject(ConnectionService);
  const router = inject(Router);
  if (connectionService.getActiveConnection()) {
    return true;
  }
  const connections = connectionService.getConnectionsValue();
  if (connections.length === 1) {
    if (connections[0].authentication !== NotSaved) {
      connectionService.activateConnection(connections[0].id);
      return true;
    }
  }

  router.navigate(['connection']);
  return false;
};
