import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, lastValueFrom, of } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { Backend, BackendUsage } from './backend.model';
import { BackendService } from './backend.service';
import { NewBackendNameComponent } from './new-backend-name/new-backend-name.component';

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

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private backendService: BackendService,
  ) {}

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

  backendBrowse(id: string) {
    this.router.navigate(['rclone', 'explore'], {
      queryParams: { drive: id },
    });
  }

  async backendRename(backend: { id: string; config: Backend }) {
    // there is no API to rename, just to create a new one and delete old one
    const copied = await this.backendDuplicate(backend);
    if (copied) {
      await this.backendDelete(backend.id);
    }
  }

  async backendDuplicate(backend: { id: string; config: Backend }) {
    const dialog = this.dialog.open(NewBackendNameComponent, {
      data: { occupiedList: this.backendList.map((backend) => backend.id) },
    });
    const newName = await lastValueFrom(dialog.afterClosed());
    if (!newName) {
      return 0;
    }
    const { type, ...options } = backend.config;
    (await this.backendService.createBackend(newName, type, options)).orThrow();
    this.backendList.push({ ...backend, id: newName });
    return 1;
  }

  async backendDelete(id: string) {
    (await this.backendService.deleteBackend(id)).orThrow();
    const index = this.backendList.findIndex((backend) => backend.id === id);
    this.backendList.splice(index, 1);
  }
}
