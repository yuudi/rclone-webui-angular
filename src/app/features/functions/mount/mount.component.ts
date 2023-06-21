import { Component, OnInit } from '@angular/core';
import { Observable, lastValueFrom, tap } from 'rxjs';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  os$ = this.mountService.getOsType();

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private mountService: MountService,
    private backendService: BackendService,
    private explorerService: ExplorerService
  ) {}

  ngOnInit() {
    this.settings$ = this.mountService.getMountSettings();
  }

  async newMountClicked() {
    const remoteList = await lastValueFrom(this.backendService.listBackends());
    const os = await lastValueFrom(this.os$);
    const dialog: MatDialogRef<
      NewMountDialogComponent,
      {
        Fs: string;
        AutoMountPoint: boolean;
        MountPoint: string;
        enabled: boolean;
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
        fsOptions: remoteList.remotes,
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
      await lastValueFrom(
        this.explorerService.createEmptyFolder('', mountPoint).pipe(
          tap({
            error: () => {
              this.snackBar.open(
                $localize`Rclone does not have access to this path, please check the permission of this path`,
                $localize`Dismiss`
              );
            },
          })
        )
      );
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

    const id = this.mountService.createSetting({
      Fs: dialogResult.Fs,
      MountPoint: mountPoint,
      MountedOn: new Date(),
      mountOpt,
      vfsOpt,
    });
    if (dialogResult.enabled) {
      try {
        await lastValueFrom(this.mountService.mount(id));
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
  }

  slideChanged(id: string, checked: boolean) {
    if (checked) {
      this.mountService.mount(id).subscribe({
        next: () => {
          this.snackBar.open($localize`Mounted`, undefined, {
            duration: 3000,
          });
        },
        error: (error) => {
          this.snackBar.open(String(error), $localize`Dismiss`);
        },
      });
    } else {
      this.mountService.unmount(id).subscribe(() => {
        this.snackBar.open($localize`Unmounted`, undefined, {
          duration: 3000,
        });
      });
    }
  }

  unmountAllClicked() {
    this.mountService.unmountAll().subscribe(() => {
      this.snackBar.open($localize`Unmounted`, undefined, {
        duration: 3000,
      });
    });
  }

  editClicked(setting: MountSetting) {
    //TODO
    console.log(setting);
    this.snackBar.open('Not implemented yet', 'Dismiss');
  }

  deleteClicked(id: string) {
    this.mountService.deleteSetting(id);
    this.snackBar.open($localize`Deleted`, undefined, {
      duration: 3000,
    });
  }
}
