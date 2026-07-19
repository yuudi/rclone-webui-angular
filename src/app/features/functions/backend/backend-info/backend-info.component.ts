import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BytesPipe } from 'src/app/shared/bytes.pipe';
import { Backend, BackendUsage } from '../backend.model';

@Component({
  selector: 'app-backend-info[backendName][backend]',
  templateUrl: './backend-info.component.html',
  styleUrls: ['./backend-info.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    BytesPipe,
  ],
})
export class BackendInfoComponent {
  @Input() backendName!: string;
  @Input() backend!: Backend;
  @Input() usage?: BackendUsage | null;
  @Output() browse = new EventEmitter();
  @Output() rename = new EventEmitter();
  @Output() duplicate = new EventEmitter();
  @Output() delete = new EventEmitter();
}
