import { Injectable } from '@angular/core';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { Backend, BackendUsage } from './backend.model';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  backendUsageCache: { [id: string]: BackendUsage } = {};

  constructor(private rc: RemoteControlService) {}

  listBackends() {
    return this.rc.call<{ remotes: string[] }>('config/listremotes');
  }

  getBackends() {
    return this.rc.call<{ [id: string]: Backend }>('config/dump');
  }

  getBackendById(id: string) {
    return this.rc.call<Backend>('config/get', { name: id });
  }

  getBackendUsage(id: string) {
    const cached = this.backendUsageCache[id];
    if (cached) {
      return of(cached);
    }
    return this.rc
      .call<BackendUsage>('operations/about', { fs: id + ':' })
      .pipe(
        tap((usage) => {
          this.backendUsageCache[id] = usage;
        })
      );
  }
}
