import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import {
  ConnectionService,
  NoAuthentication,
  NotSaved,
} from './connection.service';

export const connectionGuard: CanActivateFn = async () => {
  const connectionService = inject(ConnectionService);
  if (environment.connectSelf) {
    connectionService.activateConnection('self', NoAuthentication);
    return true;
  }
  const router = inject(Router);
  if (connectionService.getActiveConnection()) {
    return true;
  }
  const connections = await connectionService.getConnectionsValue();
  if (connections.length === 1) {
    if (connections[0].authentication !== NotSaved) {
      connectionService.activateConnection(connections[0].id);
      return true;
    }
  }

  router.navigate(['connection']);
  return false;
};
