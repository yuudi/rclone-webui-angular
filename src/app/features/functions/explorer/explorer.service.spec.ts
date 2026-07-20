import { TestBed } from '@angular/core/testing';
import { ExplorerService } from './explorer.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { JobService } from '../job/job.service';

describe('ExplorerService', () => {
  let service: ExplorerService;
  let mockRC: any;
  let mockJobService: any;

  beforeEach(() => {
    mockRC = {
      call: vi.fn(),
    };

    mockJobService = {
      callAsync: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ExplorerService,
        { provide: RemoteControlService, useValue: mockRC },
        { provide: JobService, useValue: mockJobService },
      ],
    });
    service = TestBed.inject(ExplorerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
