import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Backend, BackendUsage } from '../backend.model';

@Component({
  selector: 'app-backend-info[backendName][backend]',
  templateUrl: './backend-info.component.html',
  styleUrls: ['./backend-info.component.scss'],
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
