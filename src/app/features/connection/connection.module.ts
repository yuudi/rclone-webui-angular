import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ConnectionEditorComponent } from './connection-editor/connection-editor.component';
import { ConnectionRoutingModule } from './connection-routing.module';
import { ConnectionComponent } from './connection.component';
import { PromptPasswordComponent } from './prompt-password/prompt-password.component';

@NgModule({
  declarations: [
    ConnectionEditorComponent,
    ConnectionComponent,
    PromptPasswordComponent,
  ],
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
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: [ConnectionEditorComponent],
})
export class ConnectionModule {}
