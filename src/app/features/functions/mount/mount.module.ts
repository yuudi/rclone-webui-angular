import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MountRoutingModule } from './mount-routing.module';
import { MountComponent } from './mount.component';
import { NewMountDialogComponent } from './new-mount-dialog/new-mount-dialog.component';

@NgModule({
  declarations: [MountComponent, NewMountDialogComponent],
  imports: [
    CommonModule,
    MountRoutingModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatSlideToggleModule,
  ],
})
export class MountModule {}
