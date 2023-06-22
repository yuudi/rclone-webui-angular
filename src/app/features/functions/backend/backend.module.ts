import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { BytesPipe } from 'src/app/shared/bytes.pipe';
import { SingleClickDirective } from 'src/app/shared/single-click.directive';
import { BackendInfoComponent } from './backend-info/backend-info.component';
import { BackendRoutingModule } from './backend-routing.module';
import { BackendComponent } from './backend.component';

@NgModule({
  declarations: [
    BackendComponent,
    BackendInfoComponent,
    BytesPipe,
    SingleClickDirective,
  ],
  imports: [
    CommonModule,
    BackendRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  exports: [BackendComponent],
})
export class BackendModule {}
