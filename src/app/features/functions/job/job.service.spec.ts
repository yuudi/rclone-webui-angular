import { TestBed } from '@angular/core/testing';
import { JobService } from './job.service';
import { AppStorageService } from 'src/app/cores/storage';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { ConnectionService } from 'src/app/cores/remote-control/connection.service';
import { of } from 'rxjs';

describe('JobService', () => {
  let service: JobService;
  let mockStorageService: any;
  let mockRC: any;
  let mockConnectionService: any;

  beforeEach(() => {
    mockStorageService = {
      getObservableItem: vi.fn().mockReturnValue({
        destructor: vi.fn(),
        asObservable: vi.fn().mockReturnValue(of({ executeId: '', jobs: [] })),
        get: vi.fn().mockResolvedValue({ executeId: '', jobs: [] }),
        set: vi.fn(),
      }),
    };

    mockRC = {
      call: vi.fn().mockImplementation((operation: string, params?: any) => {
        if (operation === 'job/list') {
          return Promise.resolve({ executeId: 'test-exec', jobids: [] });
        }
        return Promise.resolve({});
      }),
    };

    mockConnectionService = {
      getActiveConnectionObservable: vi.fn().mockReturnValue(of({ id: 'test-conn' })),
    };

    TestBed.configureTestingModule({
      providers: [
        JobService,
        { provide: AppStorageService, useValue: mockStorageService },
        { provide: RemoteControlService, useValue: mockRC },
        { provide: ConnectionService, useValue: mockConnectionService },
      ],
    });
    service = TestBed.inject(JobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
