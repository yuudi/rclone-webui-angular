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
  ngOnInit(): void {
    this.dashboardService.getVersion().subscribe((version) => {
      this.version = version;
    });
    this.stat$ = this.dashboardService.getStat();
  }
}
