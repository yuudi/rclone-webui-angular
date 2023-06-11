import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

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
  constructor(private http: HttpClient, private auth: AuthService) {}

  call<T, R>(operation: string, params: T): Observable<R> {
    const remoteAddress = this.auth.getRemoteAddress();

    if (!remoteAddress) {
      throw new Error('Remote address is not set');
    }
    return this.http
      .post<R>(remoteAddress + operation, params)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
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
