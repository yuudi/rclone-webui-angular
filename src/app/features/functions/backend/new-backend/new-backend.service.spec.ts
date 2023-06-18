import { TestBed } from '@angular/core/testing';

import { NewBackendService } from './new-backend.service';

describe('NewBackendService', () => {
  let service: NewBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
