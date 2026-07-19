import { Injectable } from '@angular/core';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { AppProvider } from './new-backend.model';

@Injectable({
  providedIn: 'root',
})
export class NewBackendService {
  providersCache?: AppProvider[];

  constructor(private rc: RemoteControlService) {}

  async getProviders(): Promise<AppProvider[]> {
    if (this.providersCache) {
      return this.providersCache;
    }
    const result = await this.rc.call<{
      providers: AppProvider[];
    }>('config/providers');
    this.providersCache = result.providers;
    return this.providersCache;
  }

  createBackend(
    name: string,
    providerName: string,
    options: { [key: string]: string },
  ): Promise<void> {
    return this.rc.call('config/create', {
      name,
      type: providerName,
      parameters: options,
    });
  }
}
