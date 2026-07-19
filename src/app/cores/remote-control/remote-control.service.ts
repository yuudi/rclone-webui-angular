import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, of } from 'rxjs';

import { ConnectionService, NoAuthentication } from './connection.service';

type ErrorResponse = {
  error: string;
  input: unknown;
  status: number;
  path: string;
};

@Injectable({
  providedIn: 'root',
})
export class RemoteControlService {
  constructor(
    private http: HttpClient,
    private connectionService: ConnectionService,
  ) {}

  /**
   * call remote rclone instance, see: https://rclone.org/rc/
   */
  call<R>(
    operation: string,
    params?:
      | {
          [key: string]: string | boolean | number | Record<string, unknown>;
        }
      | FormData,
  ): Promise<R> {
    const remote = this.connectionService.getActiveConnection();
    const headers: { [key: string]: string } = {};
    if (remote && remote.authentication) {
      headers['Authorization'] = `Basic ${remote.authentication}`;
    }

    if (!remote) {
      throw new Error($localize`Remote address is not set`);
    }
    return lastValueFrom(
      this.http
        .post<R>(remote.remoteAddress + '/' + operation, params, {
          headers,
        })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.logError(error);
            const msg = String(
              error?.error?.error ?? error?.error ?? error?.message ?? error,
            );
            throw new Error(msg);
          }),
        ),
    );
    // http observable only emits once, so we can use lastValueFrom
  }

  getDownloadUrl(backend: string, file: string): string {
    const remote = this.connectionService.getActiveConnection();
    if (!remote) {
      throw new Error('Remote address is not set');
    }
    return (
      remote.remoteAddress +
      '/[' +
      (backend ? backend + ':' : '/') +
      ']/' +
      file
    );
  }

  downloadFile(backend: string, file: string): void {
    const url = this.getDownloadUrl(backend, file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.split('/').pop() ?? file;
    a.click();
    a.remove();
  }

  testConnection(
    connection?: {
      remoteAddress: string;
      credential:
        | {
            username: string;
            password: string;
          }
        | NoAuthentication;
    },
    testAuth = false,
  ): Promise<boolean> {
    let remoteAddress: string, authentication: string | NoAuthentication;
    if (connection) {
      remoteAddress = connection.remoteAddress;
      authentication = connection.credential
        ? btoa(
            connection.credential.username +
              ':' +
              connection.credential.password,
          )
        : NoAuthentication;
    } else {
      const remote = this.connectionService.getActiveConnection();
      if (!remote) {
        return Promise.resolve(false);
      }
      remoteAddress = remote.remoteAddress;
      authentication = remote.authentication;
    }

    return lastValueFrom(
      this.http
        .post(
          remoteAddress + (testAuth ? '/rc/noopauth' : '/rc/noop'),
          undefined,
          {
            headers: authentication
              ? { Authorization: `Basic ${authentication}` }
              : undefined,
            observe: 'response',
          },
        )
        .pipe(
          map((response) => response.status === 200),
          catchError(() => of(false)),
        ),
    );
  }

  private logError(error: HttpErrorResponse): void {
    if (error.status === 0) {
      // A client-side or network error occurred
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        JSON.stringify(error.error as ErrorResponse),
      );
    }
  }
}
