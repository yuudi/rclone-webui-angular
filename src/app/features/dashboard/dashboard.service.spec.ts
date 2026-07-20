import { TestBed } from '@angular/core/testing';
import { firstValueFrom, take } from 'rxjs';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let mockRemoteControlService: any;

  beforeEach(() => {
    mockRemoteControlService = {
      call: vi.fn().mockImplementation((operation: string) => {
        if (operation === 'config/listremotes') {
          return Promise.resolve({ remotes: ['drive-mock'] });
        }
        if (operation === 'core/version') {
          return Promise.resolve({ version: '1.63.0' });
        }
        if (operation === 'core/stats') {
          return Promise.resolve({ speed: 42, transfers: 1 });
        }
        return Promise.reject(new Error(`Operation not mocked: ${operation}`));
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        { provide: RemoteControlService, useValue: mockRemoteControlService },
      ],
    });
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call config/listremotes and return backends', async () => {
    const res = await service.getBackends();
    expect(mockRemoteControlService.call).toHaveBeenCalledWith(
      'config/listremotes',
    );
    expect(res).toEqual({ remotes: ['drive-mock'] });
  });

  it('should call core/version and return version info', async () => {
    const res = await service.getVersion();
    expect(mockRemoteControlService.call).toHaveBeenCalledWith('core/version');
    expect(res).toEqual({ version: '1.63.0' });
  });

  it('should call core/stats in getStat observable', async () => {
    const stat$ = service.getStat();
    const stat = await firstValueFrom(stat$.pipe(take(1)));
    expect(mockRemoteControlService.call).toHaveBeenCalledWith('core/stats');
    expect(stat).toEqual({ speed: 42, transfers: 1 });
  });
});
