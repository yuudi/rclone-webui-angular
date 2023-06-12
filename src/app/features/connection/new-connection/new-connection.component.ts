import { Component } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';

import { ConnectionService } from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';

@Component({
  selector: 'app-new-connection',
  templateUrl: './new-connection.component.html',
  styleUrls: ['./new-connection.component.scss'],
})
export class NewConnectionComponent {
  connectionForm = this.fb.nonNullable.group({
    displayName: [
      'New Connection',
      [Validators.required, this.uniqueNameValidator()],
    ],
    remoteAddress: [
      NewConnectionComponent.getCurrentHost(),
      [Validators.required, Validators.pattern(/^(http|https):\/\//)],
    ],
    username: [''],
    password: [''],
    remember: [false],
  });

  testResultCache = new Map<string, boolean>();

  static getCurrentHost(): string {
    return window.location.origin;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private connectionService: ConnectionService,
    private rc: RemoteControlService
  ) {}

  uniqueNameValidator(): ValidatorFn {
    return (control) => {
      if (this.connectionService.checkNameExists(control.value)) {
        return { nameExists: true };
      }
      return null;
    };
  }

  testConnectionClicked() {
    this.testConnection().subscribe({
      next: (success) => {
        if (success) {
          this.snackBar.open('Connection successful', 'OK', {
            duration: 3000,
          });
        } else {
          this.snackBar.open('Connection failed', 'OK', {
            duration: 3000,
          });
        }
      },
      error: () => {
        this.snackBar.open('Connection failed', 'OK', {
          duration: 3000,
        });
      },
    });
  }

  testConnection() {
    const { remoteAddress, username, password } =
      this.connectionForm.getRawValue();

    const cacheIndex = `${remoteAddress}\n${username}\n${password}`;
    const success = this.testResultCache.get(cacheIndex);
    if (success !== undefined) {
      return of(success);
    }

    const credential = username === '' ? null : { username, password };

    return this.rc.testConnection({ remoteAddress, credential }).pipe(
      tap((success) => {
        this.testResultCache.set(cacheIndex, success);
      })
    );
  }

  addConnectionClicked() {
    this.testConnection().subscribe((success) => {
      if (success) {
        this.addConnection();
        this.router.navigate(['/dashboard']);
      } else {
        this.snackBar.open('Connection failed', 'OK', {
          duration: 3000,
        });
      }
    });
  }

  addConnection() {
    const { displayName, remoteAddress, username, password, remember } =
      this.connectionForm.getRawValue();

    const credential = username === '' ? null : { username, password };

    this.connectionService.addConnection(
      displayName,
      remoteAddress,
      credential,
      remember
    );
  }
}
