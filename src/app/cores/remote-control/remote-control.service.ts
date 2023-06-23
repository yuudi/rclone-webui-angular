import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, of } from 'rxjs';

import { ConnectionService, NoAuthentication } from './connection.service';
import { Err, Ok, Result } from 'src/app/shared/result';

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
  constructor(private http: HttpClient, private auth: ConnectionService) {}

  /**
   * call remote rclone instance, see: https://rclone.org/rc/
   */
  call<R>(
    operation: string,
    params?: {
      [key: string]: string | boolean | number | Record<string, unknown>;
    }
  ): Promise<Result<R, string>> {
    const remote = this.auth.getActiveConnection();
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
          map((result) => Ok(result)),
          catchError((error: HttpErrorResponse) => {
            this.logError(error);
            return of(
              Err(String(error?.error?.error ?? error?.error ?? error))
            );
          })
        )
    );
    // http observable only emits once, so we can use lastValueFrom
  }

  getDownloadUrl(backend: string, file: string): Result<string, string> {
    const remote = this.auth.getActiveConnection();
    if (!remote) {
      return Err('Remote address is not set');
    }
    return Ok(
      remote.remoteAddress +
        '/[' +
        (backend ? backend + ':' : '/') +
        ']/' +
        file
    );
  }

  downloadFile(backend: string, file: string): Result<void, string> {
    const result = this.getDownloadUrl(backend, file);
    if (!result.ok) {
      return result;
    }
    const a = document.createElement('a');
    a.href = result.value;
    a.download = file.split('/').pop() ?? file;
    a.click();
    a.remove();
    return Ok();
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
    testAuth = false
  ): Promise<boolean> {
    let remoteAddress: string, authentication: string | NoAuthentication;
    if (connection) {
      remoteAddress = connection.remoteAddress;
      authentication = connection.credential
        ? btoa(
            connection.credential.username +
              ':' +
              connection.credential.password
          )
        : NoAuthentication;
    } else {
      const remote = this.auth.getActiveConnection();
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
          }
        )
        .pipe(
          map((response) => response.status === 200),
          catchError(() => of(false))
        )
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
        JSON.stringify(error.error as ErrorResponse)
      );
    }
  }
}
