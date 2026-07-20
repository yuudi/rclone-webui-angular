import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ConnectionService } from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { AppStorageService } from 'src/app/cores/storage';
import { CronService } from '../cron/cron.service';
import { MountService } from './mount.service';

describe('MountService', () => {
  let service: MountService;
  let mockStorageService: any;
  let mockRC: any;
  let mockConnectionService: any;
  let mockCronService: any;

  beforeEach(() => {
    mockStorageService = {
      getObservableItem: vi.fn().mockReturnValue({
        destructor: vi.fn(),
        asObservable: vi.fn().mockReturnValue(of([])),
        get: vi.fn().mockResolvedValue([]),
        set: vi.fn(),
      }),
    };

    mockRC = {
      call: vi.fn().mockImplementation((operation: string, params?: any) => {
        if (operation === 'mount/listmounts') {
          return Promise.resolve({ mountPoints: [] });
        }
        return Promise.resolve({});
      }),
    };

    mockConnectionService = {
      getActiveConnectionObservable: vi
        .fn()
        .mockReturnValue(of({ id: 'test-conn' })),
    };

    mockCronService = {
      toTask: vi.fn(),
      getSchedular: vi.fn().mockReturnValue({
        addTask: vi.fn(),
        removeTask: vi.fn(),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        MountService,
        { provide: AppStorageService, useValue: mockStorageService },
        { provide: RemoteControlService, useValue: mockRC },
        { provide: ConnectionService, useValue: mockConnectionService },
        { provide: CronService, useValue: mockCronService },
      ],
    });
    service = TestBed.inject(MountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
