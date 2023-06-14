import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { Backend, BackendUsage } from './backend.model';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(
    private rc: RemoteControlService
  ) {}

  listBackends() {
    return this.rc.call<string[]>('config/listremotes');
  }

  getBackends() {
    return this.rc.call<{ [id: string]: Backend }>('config/dump');
  }

  getBackendById(id: string) {
    return this.rc.call<Backend>('config/get', { name: id });
  }

  getBackendUsage(id: string) {
    return this.rc.call<BackendUsage>('operations/about', { fs: id + ':' });
  }
}
