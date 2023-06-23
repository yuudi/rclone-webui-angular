import { Component, OnInit } from '@angular/core';

import { Backend, BackendUsage } from './backend.model';
import { BackendService } from './backend.service';
import { Observable, of } from 'rxjs';

type Unmeasured = null;
const Unmeasured = null;

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss'],
})
export class BackendComponent implements OnInit {
  backendList: {
    id: string;
    config: Backend;
    usage$?: Observable<BackendUsage | Unmeasured>;
  }[] = [];

  constructor(private backendService: BackendService) {}

  async ngOnInit() {
    const backends = (await this.backendService.getBackends()).orThrow();
    for (const id in backends) {
      this.backendList.push({
        id,
        config: backends[id],
      });
      this.fetchUsage(id);
    }
  }

  async fetchUsage(id: string) {
    const ref = this.backendList.find((backend) => backend.id === id);
    if (!ref) {
      console.error(`Backend ${id} not found!`);
      return;
    }
    const info = (await this.backendService.getBackendInfo(id)).orThrow();
    if (!info.Features.About) {
      ref.usage$ = of(Unmeasured);
      return;
    }
    ref.usage$ = this.backendService.getBackendUsage(id);
  }
}
