import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

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
    params?: { [key: string]: string | number | Record<string, unknown> }
  ): Observable<R> {
    const remote = this.auth.getActiveConnection();

    if (!remote) {
      return throwError(() => 'Remote address is not set');
    }
    return this.http
      .post<R>(remote.remoteAddress + '/' + operation, params)
      .pipe(catchError(this.handleError));
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

  downloadFile(backend: string, file: string): Result<never, string> {
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
  ): Observable<boolean> {
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
        return of(false);
      }
      remoteAddress = remote.remoteAddress;
      authentication = remote.authentication;
    }

    return this.http
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
      .pipe(map((response) => response.status === 200));
  }

  private handleError(error: HttpErrorResponse) {
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
    return throwError(() =>
      Error('Something bad happened; please try again later.')
    );
  }
}
