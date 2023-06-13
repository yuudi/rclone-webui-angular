import { Injectable } from '@angular/core';

interface Credentials {
  username: string;
  password: string;
}

interface Connection {
  displayName: string;
  remoteAddress: string;
  /** null means no authentication, undefined means not saved */
  authentication?: string | null;
}

interface ConnectionWithAuthentication extends Connection {
  authentication: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private connections: Connection[] = [];
  private activeConnection: ConnectionWithAuthentication | null = null;

  constructor() {
    const connections = localStorage.getItem('rwa_authentication');
    if (connections) {
      this.connections = JSON.parse(connections);
      if (this.connections.length === 1) {
        this.activeConnection = this
          .connections[0] as ConnectionWithAuthentication;
        //TODO: if the only connection has no authentication, navigate to authentication page
      }

      //TODO: if there is more than one connection, navigate to connection selection page
    }
  }

  /**
   * @param remoteAddress address for remote rclone instance, without trailing slash
   */
  addConnection(
    displayName: string,
    remoteAddress: string,
    credentials: Credentials | null,
    saveAuthentication = false
  ) {
    if (this.checkNameExists(displayName)) {
      throw new Error('Name already exists');
    }

    const authentication = credentials
      ? btoa(`${credentials.username}:${credentials.password}`)
      : null;

    this.activeConnection = {
      displayName,
      remoteAddress,
      authentication,
    };

    if (saveAuthentication) {
      this.connections.push(this.activeConnection);
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

  checkNameExists(name: string): boolean {
    return this.connections.some(
      (connection) => connection.displayName === name
    );
  }

  clear() {
    this.connections = [];
    localStorage.removeItem('rwa_authentication');
  }
}
