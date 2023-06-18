import { Injectable } from '@angular/core';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';

import { AppProvider } from './new-backend.model';
import { Observable, ReplaySubject, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class NewBackendService {
  providers$ = new ReplaySubject<AppProvider[]>();

  constructor(private rc: RemoteControlService) {
    this.rc
      .call<{
        providers: AppProvider[];
      }>('config/providers')
      .pipe(map((res) => res.providers))
      .subscribe(this.providers$);
  }

  getProviders(): Observable<AppProvider[]> {
    return this.providers$;
  }

  createBackend(
    name: string,
    providerName: string,
    options: { [key: string]: string }
  ) {
    return this.rc.call('config/create', {
      name,
      type: providerName,
      parameters: options,
    });
  }
}
