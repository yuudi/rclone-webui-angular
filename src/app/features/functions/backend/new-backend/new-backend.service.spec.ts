import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { NewBackendService } from './new-backend.service';

describe('NewBackendService', () => {
  let service: NewBackendService;
  let mockRc: any;

  beforeEach(() => {
    mockRc = {
      call: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NewBackendService,
        { provide: RemoteControlService, useValue: mockRc },
      ],
    });
    service = TestBed.inject(NewBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get providers (with caching)', async () => {
    const providersList = [{ Name: 'local', Description: 'local disk' }];
    mockRc.call.mockResolvedValue({ providers: providersList });

    const providers = await service.getProviders();
    expect(mockRc.call).toHaveBeenCalledWith('config/providers');
    expect(providers).toEqual(providersList);

    // Cache hit
    mockRc.call.mockClear();
    const providersCached = await service.getProviders();
    expect(mockRc.call).not.toHaveBeenCalled();
    expect(providersCached).toEqual(providersList);
  });

  it('should create backend', async () => {
    mockRc.call.mockResolvedValue(undefined);
    await service.createBackend('drive1', 's3', { option1: 'val1' });
    expect(mockRc.call).toHaveBeenCalledWith('config/create', {
      name: 'drive1',
      type: 's3',
      parameters: { option1: 'val1' },
    });
  });
});
