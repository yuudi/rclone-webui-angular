import { Injectable } from '@angular/core';
import { Observable, map, switchMap, timer } from 'rxjs';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { RcloneVersionInfo, TransferStatus } from './dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private rc: RemoteControlService) {}

  getVersion() {
    return this.rc.call<RcloneVersionInfo>('core/version');
  }

  getStat(): Observable<TransferStatus> {
    return timer(0, 10000).pipe(
      switchMap(() => this.rc.call<TransferStatus>('core/stats')),
      map((result) => result.orThrow())
    );
  }
}
