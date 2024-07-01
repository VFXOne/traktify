import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {appEffects, appStore} from './store/store';
import {provideEffects} from '@ngrx/effects';
import {LoginService} from './services/login.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(
      {eventCoalescing: true}),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideStore(appStore),
    provideEffects(appEffects),
    LoginService
  ]
};
