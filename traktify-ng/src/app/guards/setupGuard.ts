import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {LoginManagerService} from '../services/login.service';
import {firstValueFrom} from 'rxjs';

export const setupGuard: CanActivateFn = async () => {
  const loginService = inject(LoginManagerService);
  const routingService = inject(Router);

  const isSetupComplete = await firstValueFrom(loginService.isSetupComplete());
  if (!isSetupComplete) {
    return routingService.createUrlTree(['/setup']);
  }
  return true;
};
