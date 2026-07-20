import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  NoPreloading,
  PreloadAllModules,
  provideRouter,
  withHashLocation,
  withPreloading,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withPreloading(environment.prefetch ? PreloadAllModules : NoPreloading),
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode() && environment.useServiceWorker,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
