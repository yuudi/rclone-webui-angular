import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { v4 as uuid } from 'uuid';

import { Err, Ok } from 'src/app/shared/result';

interface Credentials {
  username: string;
  password: string;
}

export interface Connection {
  id: string;
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
    connection: Omit<Connection, 'id' | 'authentication'>,
    credentials: Credentials | null,
    saveAuthentication = false
  ) {
    const { displayName, remoteAddress } = connection;

    if (this.checkNameExists(displayName)) {
      return new Err($localize`Name already exists`);
    }

    const authentication = credentials
      ? btoa(credentials.username + ':' + credentials.password)
      : null;

    this.activeConnection = {
      id: uuid(),
      displayName,
      remoteAddress,
      authentication,
    };

    let savedConnection: Connection;
    if (saveAuthentication) {
      savedConnection = this.activeConnection;
    } else {
      savedConnection = {
        ...this.activeConnection,
        authentication: undefined,
      };
    }
    const connections = this.connections$.getValue();
    connections.push(savedConnection);
    this.connections$.next(connections);
    localStorage.setItem('rwa_authentication', JSON.stringify(connections));

    return new Ok(null);
  }

  getConnection(id: string) {
    return this.connections$.getValue().find((c) => c.id === id) ?? null;
  }

  updateConnection(
    id: string,
    connection: Partial<Omit<Connection, 'id' | 'authentication'>>,
    credentials?: Credentials | null
  ) {
    const connections = this.connections$.getValue();
    const index = connections.findIndex((c) => c.id === id);
    if (index === -1) {
      return new Err($localize`Connection not found`);
    }

    const updatedConnection = {
      ...connections[index],
      ...connection,
    };

    if (credentials) {
      updatedConnection.authentication = btoa(
        credentials.username + ':' + credentials.password
      );
    }

    this.activeConnection = updatedConnection as ConnectionWithAuthentication; //TODO: prompt for authentication if not saved

    connections[index] = updatedConnection;
    this.connections$.next(connections);
    localStorage.setItem('rwa_authentication', JSON.stringify(connections));

    return new Ok(null);
  }

  activateConnection(id: string) {
    const connection = this.connections$.getValue().find((c) => c.id === id);
    if (!connection) {
      return new Err($localize`Connection not found`);
    }

    if (connection.authentication === undefined) {
      return new Err($localize`Connection has no authentication`);
    }

    return new Ok(null);
  }

  deleteConnection(id: string) {
    const connections = this.connections$.getValue();
    const index = connections.findIndex((c) => c.id === id);
    if (index === -1) {
      return new Err($localize`Connection not found`);
    }

    connections.splice(index, 1);
    this.connections$.next(connections);
    localStorage.setItem('rwa_authentication', JSON.stringify(connections));

    return new Ok(null);
  }

  getConnections(): Observable<Connection[]> {
    return this.connections$;
  }

  getActiveConnection() {
    return this.activeConnection;
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
