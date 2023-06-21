import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
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

  newMountClicked() {
    this.backendService.listBackends().subscribe((remoteList) => {
      const dialog = this.dialog.open(NewMountDialogComponent, {
        data: {
          fsOptions: remoteList.remotes,
        },
      });
      forkJoin([dialog.afterClosed(), this.os$]).subscribe(
        (
          args: [
            {
              Fs: string;
              AutoMountPoint: boolean;
              MountPoint: string;
              enabled: boolean;
            },
            string
          ]
        ) => {
          const [result, os] = args;
          if (result) {
            let mountPoint;
            if (result.AutoMountPoint) {
              const fsString = result.Fs.replace(/:$/, '');
              mountPoint =
                os === 'windows'
                  ? '\\\\rclone\\' + fsString
                  : '/mnt/rclone/' + fsString;
              if (os !== 'windows') {
                this.explorerService
                  .createEmptyFolder('', mountPoint)
                  .subscribe();
              }
            } else {
              mountPoint = result.MountPoint;
            }
            const id = this.mountService.createSetting({
              Fs: result.Fs,
              MountPoint: mountPoint,
              MountedOn: new Date(),
            });
            if (result.enabled) {
              this.mountService.mount(id).subscribe(() => {
                this.snackBar.open('Added', undefined, {
                  duration: 3000,
                });
              });
            }
          }
        }
      );
    });
    // what a hell
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
