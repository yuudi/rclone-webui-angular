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
    AutoMountPoint: [true],
    MountPoint: [''],
    enabled: [true],
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      fsOptions: string[];
    }
  ) {}
}
