import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConnectionService } from 'src/app/cores/remote-control/connection.service';
import { Err, Ok, Result } from 'src/app/shared/result';
import { SimpleDialogComponent } from 'src/app/shared/simple-dialog/simple-dialog.component';
import { AppProvider } from './new-backend.model';
import { NewBackendService } from './new-backend.service';
import { AppStorageService } from 'src/app/cores/storage';

@Component({
  selector: 'app-new-backend',
  templateUrl: './new-backend.component.html',
  styleUrls: ['./new-backend.component.scss'],
})
export class NewBackendComponent implements OnInit {
  stepperSelectedIndex = 0;
  providers?: Promise<Result<AppProvider[]>>;
  newBackendName = new FormControl('', [
    Validators.required,
    Validators.min(2),
    Validators.pattern('^[a-zA-Z0-9_-]*$'),
  ]);
  providerSelected?: AppProvider;
  providerSearchString = '';
  providerOptions: { [key: string]: string } = {};
  providerNeedAuth = false;
  showAdvancedOptions = false;
  requiredFieldHint = false;
  requiredFieldHintStorage;
  waitingForBackend = false;
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appStorageService: AppStorageService,
    private newBackendService: NewBackendService,
    private connectionService: ConnectionService
  ) {
    this.requiredFieldHintStorage = this.appStorageService.getItem(
      'NewBackendRequiredFieldHint',
      () => true
    );
  }

  ngOnInit(): void {
    this.providers = this.newBackendService.getProviders();
    (async () => {
      this.requiredFieldHint = await this.requiredFieldHintStorage.get();
    })();
  }

  hintDismissClicked() {
    this.requiredFieldHintStorage.set(false);
    this.requiredFieldHint = false;
  }

  providerSelectedChanged(provider: AppProvider) {
    this.providerSelected = provider;
    this.resetProviderOptions();
    this.providerNeedAuth = provider.Options.some(
      (option) => option.Name === 'token'
    );
  }

  providerSelectedConfirmed() {
    // warn if it is a remote backend and need auth
    const address = this.connectionService.getActiveConnection()?.remoteAddress;
    if (!address) {
      throw new Error('No active connection');
    }
    const hostname = new URL(address).hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]'
    ) {
      return;
    }

    if (this.providerSelected === undefined) {
      throw new Error('No provider selected');
    }
    const needAuth = this.providerSelected.Options.some(
      (option) => option.Name === 'token'
    );
    if (!needAuth) {
      return;
    }

    // warn user
    this.dialog
      .open(SimpleDialogComponent, {
        data: {
          title: $localize`Warning`,
          message: $localize`This provider requires authentication. Because you are using a remote backend, automatic authentication (OAuth) is not possible for you. You may need to authorize on local rclone instance and copy the token to the backend.`,
          actions: ['Go back', 'Continue Anyway'],
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result !== 'Continue Anyway') {
          this.providerSelected = undefined;
          this.stepperSelectedIndex = 0;
        }
      });
  }

  resetProviderOptions() {
    if (!this.providerSelected) {
      return Err('No provider selected');
    }
    this.providerOptions = Object.fromEntries(
      this.providerSelected.Options.map((option) => [
        option.Name,
        option.DefaultStr,
      ])
    );
    return Ok();
  }

  async saveClicked() {
    const options = Object.fromEntries(
      Object.entries(this.providerOptions).filter(([, value]) => value !== '')
    );
    if (this.providerNeedAuth && !options['token']) {
      options['token'] = '';
    }
    const name = this.newBackendName.value;
    if (!name) {
      console.error('No name provided');
      return;
    }
    const backend = this.providerSelected?.Name;
    if (!backend) {
      console.error('No backend selected');
      return;
    }
    this.waitingForBackend = true;
    const result = await this.newBackendService.createBackend(
      name,
      backend,
      options
    );
    if (result.ok) {
      this.router.navigate(['rclone', 'drive']);
    } else {
      this.snackBar.open(
        $localize`Error creating backend: ` + result.error,
        $localize`Dismiss`
      );
      this.waitingForBackend = false;
    }
  }
}
