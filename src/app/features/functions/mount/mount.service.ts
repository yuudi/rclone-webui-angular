import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap, throwError } from 'rxjs';

import { v4 as uuid } from 'uuid';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';

export interface Mount {
  Fs: string;
  MountPoint: string;
  MountedOn: Date;
}

export interface MountSetting extends Mount {
  id: string;
  enabled: boolean;
  mountType?: 'mount' | 'cmount' | 'mount2';
  mountOpt: { [key: string]: string | boolean | number };
  vfsOpt: { [key: string]: string | boolean | number };
}

@Injectable({
  providedIn: 'root',
})
export class MountService {
  private os?: string;
  private mountSettings$ = new BehaviorSubject<MountSetting[]>([]);

  constructor(private rc: RemoteControlService) {
    const storageMountSettings = localStorage.getItem('rwa_mountSettings');
    if (storageMountSettings) {
      const mountSettings: MountSetting[] = JSON.parse(storageMountSettings);
      for (const setting of mountSettings) {
        setting.enabled = false;
      }
      this.mountSettings$.next(mountSettings);
    }
    this.fetchMount();
  }

  getOsType() {
    if (this.os) {
      return of(this.os);
    }
    return this.rc
      .call<{ os: string }>('core/version')
      .pipe(map((res) => (this.os = res.os)));
  }

  getMountSettings(): Observable<MountSetting[]> {
    return this.mountSettings$;
  }

  private fetchMount() {
    this.rc
      .call<{
        mountPoints: Mount[];
      }>('mount/listmounts')
      .subscribe((res) => {
        this.mergeMountSettings(res.mountPoints);
      });
  }

  private mergeMountSettings(mounts: Mount[]) {
    const mountSettings = this.mountSettings$.getValue();
    for (const mount of mounts) {
      const index = mountSettings.findIndex(
        (m) => m.MountPoint === mount.MountPoint && m.Fs === mount.Fs
      );
      if (index === -1) {
        mountSettings.push({
          ...mount,
          enabled: true,
          id: uuid(),
          mountOpt: {},
          vfsOpt: {},
        });
      } else {
        mountSettings[index].enabled = true;
        mountSettings[index].MountedOn = mount.MountedOn;
      }
    }
    this.mountSettings$.next(mountSettings);
    localStorage.setItem('rwa_mountSettings', JSON.stringify(mountSettings));
  }

  createSetting(mountSetting: Omit<MountSetting, 'id' | 'enabled'>) {
    const id = uuid();
    const mountSettings = this.mountSettings$.getValue();
    mountSettings.push({
      ...mountSetting,
      id,
      enabled: false,
    });
    this.mountSettings$.next(mountSettings);
    localStorage.setItem('rwa_mountSettings', JSON.stringify(mountSettings));
    return id;
  }

  deleteSetting(id: string) {
    const mountSettings = this.mountSettings$.getValue();
    const index = mountSettings.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error('Mount setting ID not found when deleting');
    }
    mountSettings.splice(index, 1);
    this.mountSettings$.next(mountSettings);
    localStorage.setItem('rwa_mountSettings', JSON.stringify(mountSettings));
  }

  mount(id: string) {
    const mountSettings = this.mountSettings$.getValue();
    const setting = mountSettings.find((m) => m.id === id);
    if (setting === undefined) {
      return throwError('Mount setting ID not found');
    }
    return this.rc
      .call('mount/mount', {
        fs: setting.Fs + ':',
        mountPoint: setting.MountPoint,
        mountOpt: setting.mountOpt,
        vfsOpt: setting.vfsOpt,
      })
      .pipe(
        tap({
          next: () => {
            setting.enabled = true;
            setting.MountedOn = new Date();
            this.mountSettings$.next(mountSettings);
          },
          error: () => {
            setting.enabled = false;
            this.mountSettings$.next(mountSettings);
          },
        })
      );
  }

  unmount(id: string) {
    const mountSettings = this.mountSettings$.getValue();
    const setting = mountSettings.find((m) => m.id === id);
    if (setting === undefined) {
      return throwError('Mount setting ID not found');
    }
    return this.rc
      .call('mount/unmount', { mountPoint: setting.MountPoint })
      .pipe(
        tap(() => {
          setting.enabled = false;
          this.mountSettings$.next(mountSettings);
        })
      );
  }

  unmountAll() {
    return this.rc.call('mount/unmountall').pipe(
      tap(() => {
        const mountSettings = this.mountSettings$.getValue();
        for (const setting of mountSettings) {
          setting.enabled = false;
        }
        this.mountSettings$.next(mountSettings);
      })
    );
  }
}
