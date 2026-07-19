import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConnectionService } from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { AppStorageService, AwaitableStorageItem } from 'src/app/cores/storage';
import { Backend, BackendUsage, FsInfo } from './backend.model';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  backendUsageCacheStorage?: AwaitableStorageItem<{
    [id: string]: { usage: BackendUsage | null; updated: number };
  }>;

  backendInfoCacheStorage?: AwaitableStorageItem<{
    [id: string]: FsInfo;
  }>;

  constructor(
    private AwaitableStorageItem: AppStorageService,
    private rc: RemoteControlService,
    connectionService: ConnectionService,
  ) {
    connectionService
      .getActiveConnectionObservable()
      .subscribe((connection) => {
        if (!connection) {
          return;
        }

        this.backendUsageCacheStorage = this.AwaitableStorageItem.getItem(
          `${connection.id}-backendUsageCache`,
          () => {
            return {};
          },
        );

        this.backendInfoCacheStorage = this.AwaitableStorageItem.getItem(
          `${connection.id}-backendInfoCache`,
          () => {
            return {};
          },
        );
      });
  }

  async listBackends(): Promise<string[]> {
    const result = await this.rc.call<{ remotes: string[] }>(
      'config/listremotes',
    );
    return result.remotes;
  }

  getBackends() {
    return this.rc.call<{ [id: string]: Backend }>('config/dump');
  }

  getBackendById(id: string) {
    return this.rc.call<Backend>('config/get', { name: id });
  }

  getBackendUsage(id: string): Observable<BackendUsage | null> {
    if (!this.backendUsageCacheStorage) {
      throw new Error('backendUsageCacheStorage is not initialized');
    }
    const storage = this.backendUsageCacheStorage;
    const now = new Date().getTime() / 1000;

    // this observable will emit once or twice
    // if the cache is not expired, it will emit once
    // then it will emit again after the remote call
    return new Observable<BackendUsage | null>((observer) => {
      // this construction need a void return
      (async () => {
        const cache = await storage.get();
        const cachedUsage = cache[id];
        if (cachedUsage) {
          observer.next(cachedUsage.usage);
          if (cachedUsage.updated > now - 60 * 60) {
            return observer.complete();
          }
        }
        try {
          const usage = await this.rc.call<BackendUsage>('operations/about', {
            fs: id + ':',
          });
          cache[id] = {
            usage,
            updated: now,
          };
          storage.set(cache);
          observer.next(usage);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      })();
    });
  }

  async checkWindowsDriveExist(drive: string): Promise<boolean> {
    try {
      await this.rc.call<BackendUsage>('operations/about', {
        fs: drive + ':/',
      });
      return true;
    } catch {
      return false;
    }
  }

  async getBackendInfo(id: string): Promise<FsInfo> {
    if (!this.backendInfoCacheStorage) {
      throw new Error('backendUsageCacheStorage is not initialized');
    }
    const cache = await this.backendInfoCacheStorage.get();
    const cachedInfo = cache[id];
    if (cachedInfo) {
      return cachedInfo;
    }
    const result = await this.rc.call<FsInfo>('operations/fsinfo', {
      fs: id ? id + ':' : '/',
    });
    cache[id] = result;
    this.backendInfoCacheStorage.set(cache);
    return result;
  }

  createBackend(
    name: string,
    providerName: string,
    options: { [key: string]: string },
  ): Promise<void> {
    return this.rc.call('config/create', {
      name,
      type: providerName,
      parameters: options,
    });
  }

  deleteBackend(name: string): Promise<void> {
    return this.rc.call('config/delete', { name });
  }
}
