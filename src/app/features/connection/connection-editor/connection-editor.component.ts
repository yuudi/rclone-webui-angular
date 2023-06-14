import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of, tap } from 'rxjs';

import { ConnectionService } from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { Err, Result } from 'src/app/shared/result';

@Component({
  selector: 'app-connection-editor',
  templateUrl: './connection-editor.component.html',
  styleUrls: ['./connection-editor.component.scss'],
})
export class ConnectionEditorComponent implements OnInit {
  connectionId: string | null = null;
  connectionForm = this.fb.nonNullable.group({
    displayName: [
      'New Connection',
      [Validators.required, this.uniqueNameValidator()],
    ],
    remoteAddress: [
      ConnectionEditorComponent.getCurrentHost(),
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
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private connectionService: ConnectionService,
    private rc: RemoteControlService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.connectionId = params['id'] ?? null;
    });
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

  connectButtonClicked() {
    this.testConnection().subscribe((success) => {
      if (success) {
        let result: Result<null, string>;
        if (this.connectionId) {
          result = this.updateConnection();
        } else {
          result = this.addConnection();
        }
        if (result.ok) {
          this.router.navigate(['/dashboard']);
        } else {
          this.snackBar.open(
            $localize`Connection failed:` + result.error,
            'OK',
            {
              duration: 3000,
            }
          );
        }
      } else {
        this.snackBar.open($localize`Connection failed`, 'OK', {
          duration: 3000,
        });
      }
    });
  }

  addConnection() {
    const { displayName, remoteAddress, username, password, remember } =
      this.connectionForm.getRawValue();

    const credential = username === '' ? null : { username, password };

    return this.connectionService.addConnection(
      { displayName, remoteAddress },
      credential,
      remember
    );
  }

  updateConnection() {
    const { displayName, remoteAddress, username, password, remember } =
      this.connectionForm.getRawValue();

    const id = this.connectionId;
    if (!id) {
      return new Err('Connection ID is null');
    }

    const credential = username === '' ? null : { username, password };

    return this.connectionService.updateConnection(
      id,
      { displayName, remoteAddress },
      remember ? credential : undefined
    );
  }
}
