import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { Backend, BackendUsage, FsInfo } from './backend.model';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  backendUsageCache: {
    [id: string]: {
      usage: BackendUsage | null;
      updated: number; // Unix timestamp in seconds
    };
  } = {};

  backendInfoCache: {
    [id: string]: {
      info: FsInfo;
    };
  } = {};

  constructor(private rc: RemoteControlService) {
    const usageStorage = localStorage.getItem('rwa_BackendUsageCache');
    if (usageStorage) {
      this.backendUsageCache = JSON.parse(usageStorage);
    }

    const infoStorage = localStorage.getItem('rwa_BackendInfoCache');
    if (infoStorage) {
      this.backendInfoCache = JSON.parse(infoStorage);
    }
  }

  listBackends() {
    return this.rc.call<{ remotes: string[] }>('config/listremotes');
  }

  getBackends() {
    return this.rc.call<{ [id: string]: Backend }>('config/dump');
  }

  getBackendById(id: string) {
    return this.rc.call<Backend>('config/get', { name: id });
  }

  getBackendUsage(id: string): Observable<BackendUsage | null> {
    const now = new Date().getTime() / 1000;
    const cached = this.backendUsageCache[id];
    if (cached && cached.updated > now - 60 * 60) {
      return of(cached.usage);
    }
    return new Observable<BackendUsage | null>((observer) => {
      if (cached) {
        observer.next(cached.usage);
      }
      this.rc
        .call<BackendUsage>('operations/about', { fs: id + ':' })
        .subscribe({
          next: (usage) => {
            this.backendUsageCache[id] = {
              usage,
              updated: now,
            };
            localStorage.setItem(
              'rwaBackendUsageCache',
              JSON.stringify(this.backendUsageCache)
            );
            observer.next(usage);
            observer.complete();
          },
          error: () => {
            this.backendUsageCache[id] = {
              usage: null,
              updated: now,
            };
            localStorage.setItem(
              'rwaBackendUsageCache',
              JSON.stringify(this.backendUsageCache)
            );
            observer.next(null);
            observer.complete();
          },
        });
    });
  }

  checkWindowsDriveExist(drive: string) {
    return this.rc
      .call<BackendUsage>('operations/about', { fs: drive + ':/' })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  getBackendInfo(id: string) {
    const cached = this.backendInfoCache[id];
    if (cached) {
      return of(cached.info);
    }
    return this.rc.call<FsInfo>('operations/fsinfo', { fs: id + ':' }).pipe(
      tap((info) => {
        this.backendInfoCache[id] = {
          info,
        };
        localStorage.setItem(
          'rwa_BackendInfoCache',
          JSON.stringify(this.backendInfoCache)
        );
      })
    );
  }
}
