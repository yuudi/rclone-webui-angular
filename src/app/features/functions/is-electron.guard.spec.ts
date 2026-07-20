import { TestBed } from '@angular/core/testing';
import { isElectronGuard } from './is-electron.guard';

describe('isElectronGuard', () => {
  let originalRwaDesktop: any;

  beforeEach(() => {
    originalRwaDesktop = (globalThis as any)['RWA_DESKTOP'];
  });

  afterEach(() => {
    if (originalRwaDesktop === undefined) {
      delete (globalThis as any)['RWA_DESKTOP'];
    } else {
      (globalThis as any)['RWA_DESKTOP'] = originalRwaDesktop;
    }
  });

  const runGuard = () => {
    return TestBed.runInInjectionContext(() =>
      isElectronGuard(null as any, null as any),
    );
  };

  it('should return true if RWA_DESKTOP is defined', () => {
    (globalThis as any)['RWA_DESKTOP'] = {};
    const result = runGuard();
    expect(result).toBe(true);
  });

  it('should return false if RWA_DESKTOP is undefined', () => {
    delete (globalThis as any)['RWA_DESKTOP'];
    const result = runGuard();
    expect(result).toBe(false);
  });
});
