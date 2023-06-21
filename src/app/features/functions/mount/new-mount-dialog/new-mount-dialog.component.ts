import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-mount-dialog',
  templateUrl: './new-mount-dialog.component.html',
  styleUrls: ['./new-mount-dialog.component.scss'],
})
export class NewMountDialogComponent {
  mountForm = this.fb.nonNullable.group({
    Fs: ['', Validators.required],
    AutoMountPoint: [true], // Only for Windows
    MountPoint: [''],
    enabled: [true],
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      osType: string;
      fsOptions: string[];
    }
  ) {
    if (data.osType === 'windows') {
      this.mountForm.controls.MountPoint.setValue('Z:');
    } else {
      this.mountForm.controls.AutoMountPoint.setValue(false);
      this.mountForm.controls.MountPoint.setValue('/mnt/rclone');
    }
  }
}
