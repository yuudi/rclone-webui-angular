import { Component, EventEmitter, Inject, Output } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DirectoryItem } from '../../explorer.model';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss'],
})
export class DeleteConfirmDialogComponent {
  @Output() confirm = new EventEmitter();
  constructor(@Inject(MAT_DIALOG_DATA) public data: DirectoryItem) {}
}
