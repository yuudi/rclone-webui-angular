import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { v4 as uuid } from 'uuid';

import { Err, Ok, Result } from 'src/app/shared/result';
import { environment } from 'src/environments/environment';
import { AppStorageService } from '../storage/app-storage.service';
import { ObservableAwaitableStorageItem } from '../storage';

interface Credentials {
  username: string;
  password: string;
}

export type NotSaved = undefined;
export const NotSaved: NotSaved = undefined;
export type NoAuthentication = null;
export const NoAuthentication: NoAuthentication = null;

export interface Connection {
  id: string;
  displayName: string;
  remoteAddress: string;
  isSameOrigin: boolean;
  authentication: string | NotSaved | NoAuthentication;
}

export interface ConnectionWithAuthentication extends Connection {
  authentication: string | NoAuthentication;
}

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private activeConnection =
    new BehaviorSubject<ConnectionWithAuthentication | null>(null);
  private connectionsStorage: ObservableAwaitableStorageItem<Connection[]>;

  constructor(private appStorageService: AppStorageService) {
    this.connectionsStorage = this.appStorageService.getObservableItem(
      'connections',
      () => {
        if (environment.connectSelf) {
          return [
            {
              id: 'self',
              displayName: 'This PC',
              remoteAddress: window.location.origin,
              isSameOrigin: true,
              authentication: NoAuthentication,
            },
          ];
        } else {
          return [];
        }
      }
    );
  }

  async saveConnection(
    connection: { displayName: string; remoteAddress: string },
    credentials: Credentials | NoAuthentication | NotSaved = NotSaved
  ): Promise<Result<Connection, string>> {
    const { displayName, remoteAddress } = connection;

    if (await this.checkNameExists(displayName)) {
      return Err($localize`Name already exists`);
    }

    const authentication = credentials
      ? btoa(credentials.username + ':' + credentials.password)
      : credentials;

    const newConnection: Connection = {
      id: uuid(),
      displayName,
      remoteAddress,
      isSameOrigin: remoteAddress === window.location.origin,
      authentication,
    };

    const connections = await this.connectionsStorage.get();
    connections.push(newConnection);
    this.connectionsStorage.set(connections);

    return Ok(newConnection);
  }

  async getConnection(id: string): Promise<Connection | null> {
    const connection = await this.connectionsStorage.get();
    return connection.find((c) => c.id === id) ?? null;
  }

  async updateConnection(
    id: string,
    connection: Partial<Omit<Connection, 'id' | 'authentication'>>,
    credentials: Credentials | NoAuthentication | NotSaved = NotSaved
  ): Promise<Result<void, string>> {
    const connections = await this.connectionsStorage.get();
    const index = connections.findIndex((c) => c.id === id);
    if (index === -1) {
      return Err($localize`Connection ID not found`);
    }

    if (
      connection.displayName &&
      connection.displayName !== connections[index].displayName &&
      (await this.checkNameExists(connection.displayName))
    ) {
      return Err($localize`Name already exists`);
    }

    const updatedConnection = {
      ...connections[index],
      ...connection,
    };

    updatedConnection.authentication = credentials
      ? btoa(credentials.username + ':' + credentials.password)
      : credentials;

    connections[index] = updatedConnection;
    this.connectionsStorage.set(connections);

    return Ok();
  }

  async activateConnection(
    id: string,
    credentials?: Credentials | NoAuthentication
  ): Promise<Result<void, string>> {
    const connection = await this.getConnection(id);
    if (!connection) {
      return Err($localize`Connection not found`);
    }

    const useConnection = { ...connection }; // shallow copy
    if (credentials === undefined) {
      if (useConnection.authentication === undefined) {
        return Err($localize`Connection has no authentication`);
      }
    } else {
      useConnection.authentication = credentials
        ? btoa(credentials.username + ':' + credentials.password)
        : NoAuthentication;
    }

    this.activeConnection.next(useConnection as ConnectionWithAuthentication);

    return Ok();
  }

  async deleteConnection(id: string): Promise<Result<void, string>> {
    const connections = await this.connectionsStorage.get();
    const index = connections.findIndex((c) => c.id === id);
    if (index === -1) {
      return Err($localize`Connection not found`);
    }

    connections.splice(index, 1);
    this.connectionsStorage.set(connections);

    return Ok();
  }

  getConnections(): Observable<Connection[]> {
    return this.connectionsStorage.asObservable();
  }

  async getConnectionsValue(): Promise<Connection[]> {
    return await this.connectionsStorage.get();
  }

  getActiveConnection(): ConnectionWithAuthentication | null {
    return this.activeConnection.getValue();
  }

  getActiveConnectionObservable(): Observable<Connection | null> {
    return this.activeConnection;
  }

  async checkNameExists(name: string): Promise<boolean> {
    const connections = await this.connectionsStorage.get();
    return connections.some((connection) => connection.displayName === name);
  }

  clear() {
    this.connectionsStorage.set([]);
    this.activeConnection.next(null);
  }
}
