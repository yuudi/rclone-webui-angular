import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-dialog',
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss'],
})
export class RenameDialogComponent {
  @Output() nameChange = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<string>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      name: string;
      nameAvailable$: Observable<boolean>;
    }
  ) {}
}
