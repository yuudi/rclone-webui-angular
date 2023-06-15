import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';

import {
  Connection,
  ConnectionService,
  NoAuthentication,
  NotSaved,
} from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { Err, Result } from 'src/app/shared/result';

@Component({
  selector: 'app-connection-editor',
  templateUrl: './connection-editor.component.html',
  styleUrls: ['./connection-editor.component.scss'],
})
export class ConnectionEditorComponent implements OnInit, OnChanges {
  @Input() connection?: Connection;
  connectionForm = this.fb.nonNullable.group({
    displayName: [
      'New Connection',
      [Validators.required, this.uniqueNameValidator()],
    ],
    remoteAddress: [
      ConnectionEditorComponent.getCurrentHost(),
      [Validators.required, Validators.pattern(/^(http|https):\/\//)],
    ],
    notProtected: [false],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
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

  ngOnInit() {
    this.updateFormFromInput();
  }

  ngOnChanges() {
    this.updateFormFromInput();
  }

  private updateFormFromInput() {
    if (this.connection) {
      this.connectionForm.patchValue({
        displayName: this.connection.displayName,
        remoteAddress: this.connection.remoteAddress,
      });
    }
  }

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
          this.snackBar.open($localize`Connection successful`, 'OK', {
            duration: 3000,
          });
        } else {
          this.snackBar.open($localize`Connection failed`, 'OK', {
            duration: 3000,
          });
        }
      },
      error: () => {
        this.snackBar.open($localize`Connection failed`, 'OK', {
          duration: 3000,
        });
      },
    });
  }

  testConnection() {
    const { remoteAddress, notProtected, username, password } =
      this.connectionForm.getRawValue();

    const cacheIndex = `${remoteAddress}\n${username}\n${password}`;
    const success = this.testResultCache.get(cacheIndex);
    if (success !== undefined) {
      return of(success);
    }

    const credential = notProtected ? NoAuthentication : { username, password };

    return this.rc.testConnection({ remoteAddress, credential }).pipe(
      tap((success) => {
        this.testResultCache.set(cacheIndex, success);
      })
    );
  }

  connectButtonClicked() {
    this.testConnection().subscribe((success) => {
      if (!success) {
        this.snackBar.open($localize`Connection failed`, 'OK', {
          duration: 3000,
        });
        return;
      }
      let result: Result<null, string>;
      if (this.connection) {
        result = this.updateConnectionAndActivate();
      } else {
        result = this.addConnectionAndActivate();
      }
      if (result.ok) {
        this.router.navigate(['/dashboard']);
      } else {
        this.snackBar.open($localize`Connection failed:` + result.error, 'OK', {
          duration: 3000,
        });
      }
    });
  }

  addConnectionAndActivate() {
    const {
      displayName,
      remoteAddress,
      notProtected,
      username,
      password,
      remember,
    } = this.connectionForm.getRawValue();

    const credential = notProtected ? NoAuthentication : { username, password };

    const saveResult = this.connectionService.saveConnection(
      { displayName, remoteAddress },
      remember ? credential : NotSaved
    );

    if (!saveResult.ok) {
      return saveResult;
    }

    return this.connectionService.activateConnection(
      saveResult.value.id,
      credential
    );
  }

  updateConnectionAndActivate() {
    const {
      displayName,
      remoteAddress,
      notProtected,
      username,
      password,
      remember,
    } = this.connectionForm.getRawValue();

    const id = this.connection?.id;
    if (!id) {
      return new Err('Connection ID is null');
    }

    const credential = notProtected ? NoAuthentication : { username, password };

    return this.connectionService.updateConnection(
      id,
      { displayName, remoteAddress },
      remember ? credential : NotSaved
    );
  }
}
