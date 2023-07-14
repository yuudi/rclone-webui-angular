import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isElectronGuard } from './is-electron.guard';

describe('isElectronGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isElectronGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
