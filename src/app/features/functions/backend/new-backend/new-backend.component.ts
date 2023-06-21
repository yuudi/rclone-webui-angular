import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Err, Ok } from 'src/app/shared/result';
import { AppProvider } from './new-backend.model';
import { NewBackendService } from './new-backend.service';

@Component({
  selector: 'app-new-backend',
  templateUrl: './new-backend.component.html',
  styleUrls: ['./new-backend.component.scss'],
})
export class NewBackendComponent implements OnInit {
  providers$?: Observable<AppProvider[]>;
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
  waitingForBackend = false;
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private newBackendService: NewBackendService
  ) {}

  ngOnInit(): void {
    this.providers$ = this.newBackendService.getProviders();
    this.requiredFieldHint = !(
      localStorage.getItem('rwaNewBackendRequiredFieldHint') === 'false'
    );
  }

  hintDismissClicked() {
    localStorage.setItem('rwaNewBackendRequiredFieldHint', 'false');
    this.requiredFieldHint = false;
  }

  providerSelectedChanged(provider: AppProvider) {
    this.providerSelected = provider;
    this.resetProviderOptions();
    this.providerNeedAuth = provider.Options.some(
      (option) => option.Name === 'token'
    );
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

  saveClicked() {
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
    this.newBackendService.createBackend(name, backend, options).subscribe({
      next: () => {
        this.router.navigate(['rclone', 'drive']);
      },
      error: (err) => {
        this.snackBar.open(
          $localize`Error creating backend: ` + err,
          $localize`Dismiss`
        );
        this.waitingForBackend = false;
      },
    });
  }
}
