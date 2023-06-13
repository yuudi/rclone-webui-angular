import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { BackendRoutingModule } from './backend-routing.module';
import { BackendComponent } from './backend.component';
import { BackendInfoComponent } from './backend-info/backend-info.component';
import { BytesPipe } from 'src/app/shared/bytes.pipe';

@NgModule({
  declarations: [BackendComponent, BackendInfoComponent, BytesPipe],
  imports: [
    CommonModule,
    BackendRoutingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
})
export class BackendModule {}
