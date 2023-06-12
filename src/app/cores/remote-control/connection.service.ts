import { Injectable } from '@angular/core';

// interface Credentials {
//   username: string;
//   password: string;
// }

interface Connection {
  displayName: string;
  remoteAddress: string;
  authentication?: string;
}

interface ConnectionWithAuthentication extends Connection {
  authentication: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private connections: Connection[] = [];
  private activeConnection: ConnectionWithAuthentication | null = null;

  /**
   * @param remoteAddress address for remote rclone instance, without trailing slash
   */
  addConnection(
    displayName: string,
    remoteAddress: string,
    username: string,
    password: string,
    saveAuthentication = false
  ) {
    const authentication = btoa(`${username}:${password}`);
    const connection: ConnectionWithAuthentication = {
      displayName,
      remoteAddress,
      authentication,
    };

    this.connections.push(connection);
    if (saveAuthentication) {
      localStorage.setItem(
        'rwa_authentication',
        JSON.stringify(this.connections)
      );
    }
  }

  activateConnection(connection: ConnectionWithAuthentication) {
    this.activeConnection = connection;
  }

  deleteConnection(connection: Connection) {
    const index = this.connections.indexOf(connection);
    if (index > -1) {
      this.connections.splice(index, 1);
    }
    localStorage.setItem(
      'rwa_authentication',
      JSON.stringify(this.connections)
    );
  }

  getConnections(): Connection[] {
    return this.connections;
  }

  getRemoteAddress() {
    return this.activeConnection?.remoteAddress ?? null;
  }

  getBasicAuthorization(): string | null {
    return this.activeConnection?.authentication ?? null;
  }

  clear() {
    this.connections = [];
    localStorage.removeItem('rwa_authentication');
  }
}
