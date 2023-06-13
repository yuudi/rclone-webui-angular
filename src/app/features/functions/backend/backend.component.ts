import { Component, OnInit } from '@angular/core';

import { Backend, BackendUsage } from './backend.model';
import { BackendService } from './backend.service';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss'],
})
export class BackendComponent implements OnInit {
  backendList?: {
    id: string;
    config: Backend;
    usage?: BackendUsage;
  }[];

  constructor(private backendService: BackendService) {}

  ngOnInit() {
    this.backendService.getBackends().subscribe((backends) => {
      this.backendList = [];
      for (const id in backends) {
        this.backendList.push({
          id,
          config: backends[id],
        });
        this.fetchUsage(id);
      }
    });
  }

  fetchUsage(id: string) {
    this.backendService.getBackendUsage(id).subscribe((usage) => {
      const ref = this.backendList?.find((backend) => backend.id === id);
      if (!ref) {
        console.error(`Backend ${id} not found!`);
        return;
      }
      ref.usage = usage;
    });
  }
}
