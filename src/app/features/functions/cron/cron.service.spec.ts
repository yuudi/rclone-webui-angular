import { TestBed } from '@angular/core/testing';

import { CronService } from './cron.service';

describe('CronService', () => {
  let service: CronService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
