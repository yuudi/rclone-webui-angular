import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { connectionGuard } from './connection.guard';

describe('connectionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => connectionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
