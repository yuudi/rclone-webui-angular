import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import packageJson from '../../../../package.json';
import { environment } from '../../../environments/environment';

import { RcloneVersionInfo, TransferStatus } from './dashboard.model';
import { DashboardService } from './dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {
  backends?: string[] | null;
  goToPath = '';
  version?: RcloneVersionInfo;
  webUIVersion = packageJson.version;
  webUIEnv = environment.environment;
  stat$?: Observable<TransferStatus>;
  constructor(private dashboardService: DashboardService) {}
  async ngOnInit() {
    this.backends = (await this.dashboardService.getBackends()).remotes;
    this.version = await this.dashboardService.getVersion();
    this.stat$ = this.dashboardService.getStat();
  }
}
