import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-backend-name',
  templateUrl: './new-backend-name.component.html',
  styleUrls: ['./new-backend-name.component.scss'],
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
