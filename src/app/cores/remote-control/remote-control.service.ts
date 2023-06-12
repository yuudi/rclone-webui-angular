import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { ConnectionService } from './connection.service';

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
  call<T, R>(operation: string, params: T): Observable<R> {
    const remoteAddress = this.auth.getRemoteAddress();

    if (!remoteAddress) {
      throw new Error('Remote address is not set');
    }
    return this.http
      .post<R>(remoteAddress + '/' + operation, params)
      .pipe(catchError(this.handleError));
  }

  testConnection(
    connection?: {
      remoteAddress: string;
      credential: {
        username: string;
        password: string;
      } | null;
    },
    testAuth = false
  ): Observable<boolean> {
    const remoteAddress = connection
      ? connection.remoteAddress
      : this.auth.getRemoteAddress();
    if (!remoteAddress) {
      return of(false);
    }

    const authentication = connection
      ? connection.credential
        ? btoa(
            connection.credential.username +
              ':' +
              connection.credential.password
          )
        : null
      : this.auth.getBasicAuthorization();

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
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
