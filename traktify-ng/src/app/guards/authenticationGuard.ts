import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {LoginService} from '../facades/login.facade';

export const authenticationGuard: CanActivateFn = async () => {
  const loginService = inject(LoginService);
  const routingService = inject(Router);

  const isLoggedIn = await loginService.checkLogin();
  if (!isLoggedIn) {
    return routingService.createUrlTree(['/login']);
  }
  return true;

};
