import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardService } from './dashboard.service';
import { RcloneVersionInfo, TransferStatus } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  version?: RcloneVersionInfo;
  stat$?: Observable<TransferStatus>;
  constructor(private dashboardService: DashboardService) {}
  async ngOnInit() {
    this.version = (await this.dashboardService.getVersion()).orThrow();
    this.stat$ = this.dashboardService.getStat();
  }
}
