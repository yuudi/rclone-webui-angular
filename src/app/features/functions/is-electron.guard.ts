import { CanActivateFn } from '@angular/router';

export const isElectronGuard: CanActivateFn = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return globalThis['RWA_DESKTOP'] !== undefined;
};
