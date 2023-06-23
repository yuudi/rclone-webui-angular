import { TestBed } from '@angular/core/testing';

import { AppStorageService } from './app-storage.service';

describe('AppStorageService', () => {
  let service: AppStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
