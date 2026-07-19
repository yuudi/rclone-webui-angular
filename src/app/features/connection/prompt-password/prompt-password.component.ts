import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import {
  Connection,
  ConnectionService,
  NoAuthentication,
} from 'src/app/cores/remote-control/connection.service';

@Component({
  templateUrl: './prompt-password.component.html',
  styleUrls: ['./prompt-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class PromptPasswordComponent {
  authenticationForm = this.fb.nonNullable.group({
    notProtected: [false],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [false],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private connectionService: ConnectionService,
    @Inject(MAT_DIALOG_DATA) private data: Connection,
  ) {}

  async connectClicked() {
    if (this.authenticationForm.invalid) {
      return;
    }
    const { notProtected, username, password, remember } =
      this.authenticationForm.getRawValue();
    let credentials;
    if (notProtected) {
      credentials = NoAuthentication;
    } else {
      credentials = {
        username,
        password,
      };
    }

    try {
      if (remember) {
        await this.connectionService.updateConnection(
          this.data.id,
          {},
          credentials,
        );
      }

      await this.connectionService.activateConnection(
        this.data.id,
        credentials,
      );

      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.snackBar.open((err as Error).message, $localize`Dismiss`);
    }
  }
}
