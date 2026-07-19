import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { DirectoryItem } from '../../explorer.model';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss'],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
})
export class DeleteConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DirectoryItem[]) {
    // const length = data.length;
    // if (length == 0) {
    //   this.description = 'No files selected';
    //   console.error('No files selected when delete confirm dialog is opened');
    // } else if (length === 1) {
    //   this.description = data[0].Name;
    // } else {
    //   this.description = $localize`${length, plural, few {{{length}} items} other {{{length}} items}}`;
    // }
  }
}
