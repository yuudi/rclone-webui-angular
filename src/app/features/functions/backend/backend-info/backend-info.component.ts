import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Backend, BackendUsage } from '../backend.model';

@Component({
  selector: 'app-backend-info[backendName][backend]',
  templateUrl: './backend-info.component.html',
  styleUrls: ['./backend-info.component.scss'],
})
export class BackendInfoComponent {
  @Input() backendName!: string;
  @Input() backend!: Backend;
  @Input() usage?: BackendUsage;

  constructor(private router: Router) {}

  browseClicked() {
    this.router.navigate(['rclone', 'explore'], {
      queryParams: { drive: this.backendName },
    });
  }
}
