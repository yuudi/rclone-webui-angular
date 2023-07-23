import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { v4 as uuid } from 'uuid';

import {
  Connection,
  ConnectionService,
} from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import {
  AppStorageService,
  ObservableAwaitableStorageItem,
} from 'src/app/cores/storage';
import { CronService } from '../cron/cron.service';
import { environment } from 'src/environments/environment';
import { trimEnding } from 'src/app/shared/utils';

export interface Mount {
  Fs: string;
  MountPoint: string;
  MountedOn: Date;
}

export interface MountSetting extends Mount {
  id: string;
  enabled: boolean;
  autoMountTaskId: string | null;
  mountType?: 'mount' | 'cmount' | 'mount2';
  mountOpt: { [key: string]: string | boolean | number };
  vfsOpt: { [key: string]: string | boolean | number };
}

@Injectable({
  providedIn: 'root',
})
export class MountService {
  private os?: string;
  private mountSettingsStorage?: ObservableAwaitableStorageItem<MountSetting[]>;
  private mountSettingsSubject = new BehaviorSubject<MountSetting[]>([]);

  hasCron = environment.electron;

  constructor(
    private appStorageService: AppStorageService,
    private rc: RemoteControlService,
    connectionService: ConnectionService,
    private cronService: CronService,
  ) {
    this.fetchMount();
    connectionService
      .getActiveConnectionObservable()
      .subscribe((connection) => {
        if (!connection) {
          return;
        }
        this.connectionChanged(connection);
      });
  }

  private connectionChanged(connection: Connection) {
    this.mountSettingsStorage?.destructor();
    this.mountSettingsStorage = this.appStorageService.getObservableItem(
      `${connection.id}-mountSettings`,
      () => [],
    );
    this.mountSettingsStorage.asObservable().subscribe(
      this.mountSettingsSubject.next.bind(this.mountSettingsSubject), //only take next, not error or complete
    );
  }

  getMountSettings(): Observable<MountSetting[]> {
    return this.mountSettingsSubject;
  }

  async getOsType(): Promise<string> {
    return (await this.rc.call<{ os: string }>('core/version')).orThrow().os;
  }

  private async fetchMount() {
    const mountPoints = (
      await this.rc.call<{
        mountPoints: Mount[];
      }>('mount/listmounts')
    ).orThrow().mountPoints;
    this.mergeMountSettings(mountPoints);
  }

  private async mergeMountSettings(mounts: Mount[]) {
    if (!this.mountSettingsStorage) {
      throw new Error('Mount settings storage not initialized');
    }
    const mountSettings = await this.mountSettingsStorage.get();
    if (!this.hasCron) {
      // if no cron, treat as nothing is mounted
      for (const setting of mountSettings) {
        setting.enabled = false;
      }
    }
    for (const mount of mounts) {
      // incoming mount point is always ended with ':'
      const fsWithoutColon = trimEnding(mount.Fs, ':');
      const index = mountSettings.findIndex((m) => {
        return m.MountPoint === mount.MountPoint && m.Fs === fsWithoutColon;
      });
      if (index === -1) {
        mountSettings.push({
          Fs: fsWithoutColon,
          MountPoint: mount.MountPoint,
          MountedOn: mount.MountedOn,
          enabled: true,
          autoMountTaskId: null,
          id: uuid(),
          mountOpt: {},
          vfsOpt: {},
        });
      } else {
        mountSettings[index].enabled = true;
        mountSettings[index].MountedOn = mount.MountedOn;
      }
    }
    await this.mountSettingsStorage.set(mountSettings);
  }

  async createSetting(
    mountSetting: Omit<MountSetting, 'id' | 'enabled' | 'autoMountTaskId'>,
  ) {
    if (!this.mountSettingsStorage) {
      throw new Error('Mount settings storage not initialized');
    }
    const id = uuid();
    const mountSettings = await this.mountSettingsStorage.get();
    mountSettings.push({
      ...mountSetting,
      id,
      enabled: false,
      autoMountTaskId: null,
    });
    await this.mountSettingsStorage.set(mountSettings);
    return id;
  }

  async deleteSetting(id: string) {
    if (!this.mountSettingsStorage) {
      throw new Error('Mount settings storage not initialized');
    }
    const mountSettings = await this.mountSettingsStorage.get();
    const index = mountSettings.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error('Mount setting ID not found when deleting');
    }
    if (mountSettings[index].enabled) {
      await this.unmount(id);
    }
    mountSettings.splice(index, 1);
    await this.mountSettingsStorage.set(mountSettings);
  }

  async mount(id: string) {
    if (!this.mountSettingsStorage) {
      throw new Error('Mount settings storage not initialized');
    }
    const mountSettings = await this.mountSettingsStorage.get();
    const setting = mountSettings.find((m) => m.id === id);
    if (setting === undefined) {
      throw new Error('Mount setting ID not found');
    }
    const result = await this.rc.call('mount/mount', {
      fs: setting.Fs + ':',
      mountPoint: setting.MountPoint,
      mountOpt: setting.mountOpt,
      vfsOpt: setting.vfsOpt,
    });
    if (result.ok) {
      setting.enabled = true;
      setting.MountedOn = new Date();
    } else {
      setting.enabled = false;
    }
    await this.mountSettingsStorage.set(mountSettings);
    return result;
  }

  async unmount(id: string) {
    if (!this.mountSettingsStorage) {
      throw new Error('Mount settings storage not initialized');
    }
    const mountSettings = await this.mountSettingsStorage.get();
    const setting = mountSettings.find((m) => m.id === id);
    if (setting === undefined) {
      throw new Error('Mount setting ID not found');
    }
    const result = await this.rc.call('mount/unmount', {
      mountPoint: setting.MountPoint,
    });
    if (result.ok) {
      setting.enabled = false;
      await this.mountSettingsStorage.set(mountSettings);
    }
    return result;
  }

  async unmountAll() {
    const result = await this.rc.call('mount/unmountall');
    if (result.ok) {
      if (!this.mountSettingsStorage) {
        throw new Error('Mount settings storage not initialized');
      }
      const mountSettings = await this.mountSettingsStorage.get();
      for (const setting of mountSettings) {
        setting.enabled = false;
      }
      await this.mountSettingsStorage.set(mountSettings);
    }
    return result;
  }

  async enableAutoMount(id: string) {
    if (!this.mountSettingsStorage) {
      throw new Error('Mount settings storage not initialized');
    }
    const mountSettings = await this.mountSettingsStorage.get();
    const setting = mountSettings.find((m) => m.id === id);
    if (setting === undefined) {
      throw new Error('Mount setting ID not found');
    }
    if (setting.autoMountTaskId) {
      throw new Error('Mount setting already has auto mount enabled');
    }
    const expression = '@startup';
    const task = await this.cronService.toTask(expression, 'mount/mount', {
      fs: setting.Fs + ':',
      mountPoint: setting.MountPoint,
      mountOpt: setting.mountOpt,
      vfsOpt: setting.vfsOpt,
    });
    setting.autoMountTaskId = task.id;
    this.mountSettingsStorage.set(mountSettings);
    this.cronService.getSchedular()?.addTask(task);
  }

  async disableAutoMount(id: string) {
    if (!this.mountSettingsStorage) {
      throw new Error('Mount settings storage not initialized');
    }
    const mountSettings = await this.mountSettingsStorage.get();
    const setting = mountSettings.find((m) => m.id === id);
    if (setting === undefined) {
      throw new Error('Mount setting ID not found');
    }
    if (!setting.autoMountTaskId) {
      console.warn('Mount setting does not have auto mount enabled');
      return;
    }
    this.cronService.getSchedular()?.removeTask(setting.autoMountTaskId);
    setting.autoMountTaskId = null;
    this.mountSettingsStorage.set(mountSettings);
  }
}
