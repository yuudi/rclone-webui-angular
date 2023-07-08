import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-copy-dialog',
  templateUrl: './copy-dialog.component.html',
  styleUrls: ['./copy-dialog.component.scss'],
})
export class CopyDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      content: string;
    },
  ) {}
}
