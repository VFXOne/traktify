import {CanActivateFn, Router} from '@angular/router';
import {LoginService} from '../services/login.service';
import {inject} from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const routingService = inject(Router);

  if (!loginService.isLoggedIn()) {
    routingService.navigateByUrl('/');
    return false;
  }

  return true;
};
