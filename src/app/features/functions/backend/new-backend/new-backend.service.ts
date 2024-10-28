import { Injectable } from '@angular/core';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { Ok, Result } from 'src/app/shared/result';
import { AppProvider } from './new-backend.model';

@Injectable({
  providedIn: 'root',
})
export class NewBackendService {
  providersCache?: AppProvider[];

  constructor(private rc: RemoteControlService) {}

  async getProviders(): Promise<Result<AppProvider[], string>> {
    if (this.providersCache) {
      return Ok(this.providersCache);
    }
    const result = await this.rc.call<{
      providers: AppProvider[];
    }>('config/providers');
    if (!result.ok) {
      return result;
    }
    this.providersCache = result.value.providers;
    return Ok(this.providersCache);
  }

  createBackend(
    name: string,
    providerName: string,
    options: { [key: string]: string },
  ): Promise<Result<void, string>> {
    return this.rc.call('config/create', {
      name,
      type: providerName,
      parameters: options,
    });
  }
}
