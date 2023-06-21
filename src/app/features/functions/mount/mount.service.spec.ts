import { TestBed } from '@angular/core/testing';

import { MountService } from './mount.service';

describe('MountService', () => {
  let service: MountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
