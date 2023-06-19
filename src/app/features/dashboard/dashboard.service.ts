import { Injectable } from '@angular/core';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import {
  RcloneVersionInfo,
  TransferStatus as TransferStatistics,
} from './dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private rc: RemoteControlService) {}

  getVersion() {
    return this.rc.call<RcloneVersionInfo>('core/version');
  }

  getStat() {
    return this.rc.call<TransferStatistics>('core/stats');
  }
}
