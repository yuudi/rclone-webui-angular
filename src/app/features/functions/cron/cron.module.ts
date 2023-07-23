import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { CronEditorComponent } from './cron-editor/cron-editor.component';
import { EasyCronComponent } from './cron-editor/easy-cron/easy-cron.component';
import { CronRoutingModule } from './cron-routing.module';
import { CronComponent } from './cron.component';

@NgModule({
  declarations: [CronComponent, CronEditorComponent, EasyCronComponent],
  imports: [
    CommonModule,
    CronRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSnackBarModule,
  ],
})
export class CronModule {}
