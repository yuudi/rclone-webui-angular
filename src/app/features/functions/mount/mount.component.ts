import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MountService, MountSetting } from './mount.service';
import { NewMountDialogComponent } from './new-mount-dialog/new-mount-dialog.component';

@Component({
  selector: 'app-mount',
  templateUrl: './mount.component.html',
  styleUrls: ['./mount.component.scss'],
})
export class MountComponent implements OnInit {
  settings$?: Observable<MountSetting[]>;
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private mountService: MountService
  ) {}

  ngOnInit() {
    this.settings$ = this.mountService.getMountSettings();
  }

  newMountClicked() {
    this.dialog.open(NewMountDialogComponent);
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
