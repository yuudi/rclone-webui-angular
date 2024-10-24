import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import packageJson from '../../../../package.json';
import { environment } from '../../../environments/environment';

import { DashboardService } from './dashboard.service';
import { RcloneVersionInfo, TransferStatus } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  version?: RcloneVersionInfo;
  webUIVersion = packageJson.version;
  webUIEnv = environment.environment;
  stat$?: Observable<TransferStatus>;
  constructor(private dashboardService: DashboardService) {}
  async ngOnInit() {
    this.version = (await this.dashboardService.getVersion()).orThrow();
    this.stat$ = this.dashboardService.getStat();
  }
}
