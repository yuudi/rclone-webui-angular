import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';

import { SearchPipe } from 'src/app/shared/search.pipe';
import { NewBackendRoutingModule } from './new-backend-routing.module';
import { NewBackendComponent } from './new-backend.component';

@NgModule({
  declarations: [NewBackendComponent, SearchPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    NewBackendRoutingModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
})
export class NewBackendModule {}
