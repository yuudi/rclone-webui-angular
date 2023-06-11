import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class RemoteControlService {
  remoteAddress: string | null = null;

  constructor(private http: HttpClient) {}

  call<T, R>(operation: string, params: T): Observable<R> {
    if (!this.remoteAddress) {
      throw new Error('Remote address is not set');
    }
    return this.http.post<R>(this.remoteAddress + operation, params);
  }
}
