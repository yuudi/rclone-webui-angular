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
    let mountPoint;
    if (dialogResult.AutoMountPoint) {
      const fsString = dialogResult.Fs.replace(/:$/, '');
      mountPoint =
        os === 'windows'
          ? '\\\\rclone\\' + fsString
          : '/mnt/rclone/' + fsString;
      if (os !== 'windows') {
        await lastValueFrom(
          this.explorerService.createEmptyFolder('', mountPoint).pipe(
            tap({
              error: () => {
                this.snackBar.open(
                  $localize`Rclone does not have access to this path, please check the permission of this path`,
                  'Dismiss'
                );
              },
            })
          )
        );
      }
      const id = this.mountService.createSetting({
        Fs: dialogResult.Fs,
        MountPoint: mountPoint,
        MountedOn: new Date(),
      });
      if (dialogResult.enabled) {
        await lastValueFrom(this.mountService.mount(id));
      }
      this.snackBar.open($localize`Mount created`, undefined, {
        duration: 3000,
      });
    }
  }

  slideChanged(id: string, checked: boolean) {
    if (checked) {
      this.mountService.mount(id).subscribe(() => {
        this.snackBar.open('Mounted', undefined, {
          duration: 3000,
        });
      });
    } else {
      this.mountService.unmount(id).subscribe(() => {
        this.snackBar.open('Unmounted', undefined, {
          duration: 3000,
        });
      });
    }
  }

  unmountAllClicked() {
    this.mountService.unmountAll().subscribe(() => {
      this.snackBar.open('Unmounted', undefined, {
        duration: 3000,
      });
    });
  }
}
