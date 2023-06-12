import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

import { ConnectionRoutingModule } from './connection-routing.module';
import { NewConnectionComponent } from './new-connection/new-connection.component';

@NgModule({
  declarations: [NewConnectionComponent],
  imports: [
    CommonModule,
    ConnectionRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  exports: [NewConnectionComponent],
})
export class ConnectionModule {}
