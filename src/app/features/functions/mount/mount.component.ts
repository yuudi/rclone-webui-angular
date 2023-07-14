import { Component, OnInit } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from 'src/environments/environment';
import { BackendService } from '../backend/backend.service';
import { ExplorerService } from '../explorer/explorer.service';
import { MountService, MountSetting } from './mount.service';
import { NewMountDialogComponent } from './new-mount-dialog/new-mount-dialog.component';

@Component({
  selector: 'app-mount',
  templateUrl: './mount.component.html',
  styleUrls: ['./mount.component.scss'],
})
export class MountComponent implements OnInit {
  settings$?: Observable<MountSetting[]>;
  os = this.mountService.getOsType();
  hasCron = environment.electron;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private mountService: MountService,
    private backendService: BackendService,
    private explorerService: ExplorerService,
  ) {}

  ngOnInit() {
    this.settings$ = this.mountService.getMountSettings();
  }

  async newMountClicked() {
    const remoteList = (await this.backendService.listBackends()).orThrow();
    const os = await this.os;
    const dialog: MatDialogRef<
      NewMountDialogComponent,
      {
        Fs: string;
        AutoMountPoint: boolean;
        MountPoint: string;
        enabled: boolean;
        autoMount: boolean;
        readonly?: boolean;
        windowsNetworkMode?: boolean;
        filePerms?: string;
        dirPerms?: string;
        noModTime?: boolean;
        vfsCacheMode?: string;
        vfsCacheMaxAge?: string;
      }
    > = this.dialog.open(NewMountDialogComponent, {
      data: {
        osType: os,
        fsOptions: remoteList,
      },
    });
    const dialogResult = await lastValueFrom(dialog.afterClosed());
    if (!dialogResult) {
      // user canceled
      return;
    }
    let mountPoint = dialogResult.MountPoint;
    if (dialogResult.AutoMountPoint) {
      const fsString = dialogResult.Fs.replace(/:$/, '');
      mountPoint =
        os === 'windows'
          ? '\\\\rclone\\' + fsString
          : '/mnt/rclone/' + fsString;
    }
    if (os !== 'windows') {
      const result = await this.explorerService.createEmptyFolder(
        '',
        mountPoint,
      );
      if (!result.ok) {
        this.snackBar.open(
          $localize`Rclone does not have access to this path, please check the permission of this path`,
          $localize`Dismiss`,
        );
        return;
      }
    }
    const mountOpt: { [key: string]: string | boolean | number } = {};
    const vfsOpt: { [key: string]: string | boolean | number } = {};
    if (dialogResult.readonly !== undefined) {
      mountOpt['readonly'] = dialogResult.readonly;
    }
    if (dialogResult.windowsNetworkMode !== undefined) {
      mountOpt['windowsNetworkMode'] = dialogResult.windowsNetworkMode;
    }
    if (dialogResult.filePerms !== undefined) {
      vfsOpt['filePerms'] = parseInt(dialogResult.filePerms, 8);
    }
    if (dialogResult.dirPerms !== undefined) {
      vfsOpt['dirPerms'] = parseInt(dialogResult.dirPerms, 8);
    }
    if (dialogResult.noModTime !== undefined) {
      mountOpt['noModTime'] = dialogResult.noModTime;
    }
    if (dialogResult.vfsCacheMode !== undefined) {
      vfsOpt['vfsCacheMode'] = dialogResult.vfsCacheMode;
    }
    if (dialogResult.vfsCacheMaxAge !== undefined) {
      vfsOpt['vfsCacheMaxAge'] = dialogResult.vfsCacheMaxAge;
    }

    const id = await this.mountService.createSetting({
      Fs: dialogResult.Fs,
      MountPoint: mountPoint,
      MountedOn: new Date(),
      mountOpt,
      vfsOpt,
    });
    if (dialogResult.enabled) {
      try {
        await this.mountService.mount(id);
        this.snackBar.open($localize`Mount created and mounted`, undefined, {
          duration: 3000,
        });
      } catch (error) {
        this.snackBar.open(String(error), $localize`Dismiss`);
      }
    } else {
      this.snackBar.open($localize`Mount created`, undefined, {
        duration: 3000,
      });
    }
    if (dialogResult.autoMount) {
      this.mountService.enableAutoMount(id);
    }
  }

  async slideChanged(id: string, checked: boolean) {
    if (checked) {
      const result = await this.mountService.mount(id);
      if (this.hasCron) {
        await this.mountService.enableAutoMount(id);
      }
      if (result.ok) {
        this.snackBar.open($localize`Mounted`, undefined, {
          duration: 3000,
        });
      } else {
        this.snackBar.open(result.error, $localize`Dismiss`);
      }
    } else {
      const result = await this.mountService.unmount(id);
      if (this.hasCron) {
        await this.mountService.disableAutoMount(id);
      }
      if (result.ok) {
        this.snackBar.open($localize`Unmounted`, undefined, {
          duration: 3000,
        });
      } else {
        this.snackBar.open(result.error, $localize`Dismiss`);
      }
    }
  }

  async unmountAllClicked() {
    const result = await this.mountService.unmountAll();
    if (result.ok) {
      this.snackBar.open($localize`Unmounted`, undefined, {
        duration: 3000,
      });
    } else {
      this.snackBar.open(result.error, $localize`Dismiss`);
    }
  }

  editClicked(setting: MountSetting) {
    //TODO
    console.log(setting);
    this.snackBar.open('Not implemented yet', $localize`Dismiss`);
  }

  async deleteClicked(id: string) {
    if (this.hasCron) {
      await this.mountService.disableAutoMount(id);
    }
    this.mountService.deleteSetting(id);
    this.snackBar.open($localize`Deleted`, undefined, {
      duration: 3000,
    });
  }
}
