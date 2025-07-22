import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import {
  Connection,
  ConnectionService,
  NoAuthentication,
  NotSaved,
} from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { Err } from 'src/app/shared/result';
import { environment } from 'src/environments/environment';

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
      [Validators.required],
      [this.uniqueNameValidator()],
    ],
    remoteAddress: [
      environment.connectSelf ? ConnectionEditorComponent.getCurrentHost() : '',
      [
        Validators.required,
        Validators.pattern(/^(http|https):\/\//),
        this.secureContextValidator(),
      ],
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
    private rc: RemoteControlService,
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

  uniqueNameValidator(): AsyncValidatorFn {
    return async (control) => {
      if (control.value === this.connection?.displayName) {
        // The name is not changed
        return null;
      }
      if (await this.connectionService.checkNameExists(control.value)) {
        return { nameExists: true };
      }
      return null;
    };
  }

  secureContextValidator(): ValidatorFn {
    return (control) => {
      let url;
      try {
        url = new URL(control.value);
      } catch (e) {
        return { pattern: true };
      }
      if (url.protocol === 'https:') {
        return null;
      }
      if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
        return null;
      }
      return { insecureContext: true };
    };
  }

  async testConnectionClicked() {
    const result = await this.testConnection();
    if (result) {
      this.snackBar.open($localize`Connection successful`, 'OK', {
        duration: 3000,
      });
    } else {
      this.snackBar.open($localize`Connection failed`, 'OK', {
        duration: 3000,
      });
    }
  }

  async testConnection(): Promise<boolean> {
    const { remoteAddress, notProtected, username, password } =
      this.connectionForm.getRawValue();

    const cacheIndex = `${remoteAddress}\n${username}\n${password}`;
    const success = this.testResultCache.get(cacheIndex);
    if (success !== undefined) {
      return success;
    }

    const credential = notProtected ? NoAuthentication : { username, password };
    const result = await this.rc.testConnection({ remoteAddress, credential });
    this.testResultCache.set(cacheIndex, result);
    return result;
  }

  async connectButtonClicked() {
    const connectResult = await this.testConnection();
    if (!connectResult) {
      this.snackBar.open($localize`Connection failed`, 'OK', {
        duration: 3000,
      });
      return;
    }
    let result;
    if (this.connection) {
      result = await this.updateConnectionAndActivate();
    } else {
      result = await this.addConnectionAndActivate();
    }
    if (result.ok) {
      this.router.navigate(['/dashboard']);
    } else {
      this.snackBar.open($localize`Connection failed:` + result.error, 'OK', {
        duration: 3000,
      });
    }
  }

  async addConnectionAndActivate() {
    const {
      displayName,
      remoteAddress,
      notProtected,
      username,
      password,
      remember,
    } = this.connectionForm.getRawValue();

    const credential = notProtected ? NoAuthentication : { username, password };

    const saveResult = await this.connectionService.saveConnection(
      { displayName, remoteAddress },
      remember ? credential : NotSaved,
    );

    if (!saveResult.ok) {
      return saveResult;
    }

    return this.connectionService.activateConnection(
      saveResult.value.id,
      credential,
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
      return Err('Connection ID is null');
    }

    const credential = notProtected ? NoAuthentication : { username, password };

    return this.connectionService.updateConnection(
      id,
      { displayName, remoteAddress },
      remember ? credential : NotSaved,
    );
  }
}
