import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConnectionService } from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { AppStorageService } from 'src/app/cores/storage';
import { BackendService } from './backend.service';

describe('BackendService', () => {
  let service: BackendService;
  let mockRc: any;
  let mockConnectionService: any;
  let mockAppStorageService: any;
  let mockStorageItem: any;

  beforeEach(() => {
    mockRc = {
      call: vi.fn(),
    };

    mockConnectionService = {
      getActiveConnectionObservable: vi
        .fn()
        .mockReturnValue(of({ id: 'test-conn' })),
    };

    mockStorageItem = {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn(),
    };

    mockAppStorageService = {
      getItem: vi.fn().mockReturnValue(mockStorageItem),
    };

    TestBed.configureTestingModule({
      providers: [
        BackendService,
        { provide: RemoteControlService, useValue: mockRc },
        { provide: ConnectionService, useValue: mockConnectionService },
        { provide: AppStorageService, useValue: mockAppStorageService },
      ],
    });
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(
      mockConnectionService.getActiveConnectionObservable,
    ).toHaveBeenCalled();
    expect(mockAppStorageService.getItem).toHaveBeenCalledWith(
      'test-conn-backendUsageCache',
      expect.any(Function),
    );
    expect(mockAppStorageService.getItem).toHaveBeenCalledWith(
      'test-conn-backendInfoCache',
      expect.any(Function),
    );
  });

  it('should list backends', async () => {
    mockRc.call.mockResolvedValue({ remotes: ['drive1', 'drive2'] });
    const remotes = await service.listBackends();
    expect(mockRc.call).toHaveBeenCalledWith('config/listremotes');
    expect(remotes).toEqual(['drive1', 'drive2']);
  });

  it('should get backends config dump', async () => {
    const mockDump = { drive1: { type: 's3' } };
    mockRc.call.mockResolvedValue(mockDump);
    const dump = await service.getBackends();
    expect(mockRc.call).toHaveBeenCalledWith('config/dump');
    expect(dump).toEqual(mockDump);
  });

  it('should get backend by id', async () => {
    const mockConfig = { type: 's3' };
    mockRc.call.mockResolvedValue(mockConfig);
    const config = await service.getBackendById('drive1');
    expect(mockRc.call).toHaveBeenCalledWith('config/get', { name: 'drive1' });
    expect(config).toEqual(mockConfig);
  });

  it('should create backend', async () => {
    mockRc.call.mockResolvedValue(undefined);
    await service.createBackend('drive1', 's3', { provider: 'aws' });
    expect(mockRc.call).toHaveBeenCalledWith('config/create', {
      name: 'drive1',
      type: 's3',
      parameters: { provider: 'aws' },
    });
  });

  it('should delete backend', async () => {
    mockRc.call.mockResolvedValue(undefined);
    await service.deleteBackend('drive1');
    expect(mockRc.call).toHaveBeenCalledWith('config/delete', {
      name: 'drive1',
    });
  });

  it('should check if windows drive exists', async () => {
    mockRc.call.mockResolvedValue({});
    let exists = await service.checkWindowsDriveExist('C');
    expect(mockRc.call).toHaveBeenCalledWith('operations/about', { fs: 'C:/' });
    expect(exists).toBe(true);

    mockRc.call.mockRejectedValue(new Error('not found'));
    exists = await service.checkWindowsDriveExist('C');
    expect(exists).toBe(false);
  });

  it('should get backend info (with caching)', async () => {
    const infoData = { Features: { About: true } };
    mockStorageItem.get.mockResolvedValue({});
    mockRc.call.mockResolvedValue(infoData);

    const info = await service.getBackendInfo('drive1');
    expect(mockRc.call).toHaveBeenCalledWith('operations/fsinfo', {
      fs: 'drive1:',
    });
    expect(info).toEqual(infoData);
    expect(mockStorageItem.set).toHaveBeenCalled();

    // Cache hit test
    mockRc.call.mockClear();
    mockStorageItem.get.mockResolvedValue({ drive1: infoData });
    const infoCached = await service.getBackendInfo('drive1');
    expect(mockRc.call).not.toHaveBeenCalled();
    expect(infoCached).toEqual(infoData);
  });

  it('should get backend usage (with caching)', async () => {
    const usageData = { total: 100, used: 40 };
    mockStorageItem.get.mockResolvedValue({});
    mockRc.call.mockResolvedValue(usageData);

    const usage$ = service.getBackendUsage('drive1');
    const resultPromise = new Promise((resolve) => {
      usage$.subscribe((res) => {
        if (res && res.total === 100) resolve(res);
      });
    });

    const result = await resultPromise;
    expect(mockRc.call).toHaveBeenCalledWith('operations/about', {
      fs: 'drive1:',
    });
    expect(result).toEqual(usageData);
  });
});
