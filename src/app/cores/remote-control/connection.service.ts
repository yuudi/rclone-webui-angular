import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Err, Ok } from 'src/app/shared/result';

interface Credentials {
  username: string;
  password: string;
}

export interface Connection {
  displayName: string;
  remoteAddress: string;
  /** null means no authentication, undefined means not saved */
  authentication?: string | null;
}

export interface ConnectionWithAuthentication extends Connection {
  authentication: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private connections$ = new BehaviorSubject<Connection[]>([]);
  private activeConnection: ConnectionWithAuthentication | null = null;

  constructor() {
    const connectionsJson = localStorage.getItem('rwa_authentication');
    if (connectionsJson) {
      const connections: Connection[] = JSON.parse(connectionsJson);
      this.connections$.next(connections);
      if (connections.length === 1) {
        const onlyConnection = connections[0];

        if (onlyConnection.authentication === undefined) {
          //TODO: if the only connection has no authentication, navigate to authentication page
          //navigate()
          return;
        }

        this.activeConnection = onlyConnection as ConnectionWithAuthentication;
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
      return new Err($localize`Name already exists`);
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
      const connections = this.connections$.getValue();
      connections.push(this.activeConnection);
      this.connections$.next(connections);
      localStorage.setItem('rwa_authentication', JSON.stringify(connections));
    }

    return new Ok(null);
  }

  activateConnection(connection: ConnectionWithAuthentication) {
    this.activeConnection = connection;
  }

  deleteConnection(connection: Connection) {
    const connections = this.connections$.getValue();
    const index = connections.indexOf(connection);
    if (index > -1) {
      connections.splice(index, 1);
    }
    this.connections$.next(connections);
    localStorage.setItem('rwa_authentication', JSON.stringify(connections));
  }

  getConnections() {
    return this.connections$.asObservable();
  }

  getRemoteAddress() {
    return this.activeConnection?.remoteAddress ?? null;
  }

  getBasicAuthorization(): string | null {
    return this.activeConnection?.authentication ?? null;
  }

  checkNameExists(name: string): boolean {
    return this.connections$
      .getValue()
      .some((connection) => connection.displayName === name);
  }

  clear() {
    this.connections$.next([]);
    this.activeConnection = null;
    localStorage.removeItem('rwa_authentication');
  }
}
