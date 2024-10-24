import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function jsonStringValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      JSON.parse(control.value);
      return null;
    } catch {
      return { invalidJsonString: true };
    }
  };
}
