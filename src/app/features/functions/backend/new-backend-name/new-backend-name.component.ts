import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-backend-name',
  templateUrl: './new-backend-name.component.html',
  styleUrls: ['./new-backend-name.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class NewBackendNameComponent {
  newName = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { occupiedList: string[] },
  ) {}
}

// function uniqueNameValidator(nameList: string[]): ValidatorFn {
//   return (control: AbstractControl) => {
//     return nameList.includes(control.value) ? { nameExist: true } : null;
//   };
// }
