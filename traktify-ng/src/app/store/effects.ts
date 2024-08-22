import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LoginService} from '../services/login.service';
import {checkLogin, loginFailure, loginInProgress, loginSuccess} from './actions';
import {catchError, map, mergeMap, of} from 'rxjs';

@Injectable()
export class LoginEffects {
  login = createEffect(() => this.actions.pipe(
    ofType(loginInProgress),
    mergeMap(() =>
      this.loginService.login().pipe(
        map(username => {
          return loginSuccess({username});
        }),
        catchError(error => of(loginFailure({error})))
      )
    )
  ));

  checkLogin = createEffect(() => this.actions.pipe(
    ofType(checkLogin),
    mergeMap(() =>
      this.loginService.isLoggedIn().pipe(
        map(isLoggedIn => {
          if (isLoggedIn) {
            return loginSuccess({username : "already logged in"});
          } else {
            return loginFailure({'error': 'Not logged in'});
          }
        }),
        catchError(error => of(loginFailure({error})))
      )
    )
  ));

  constructor(private actions: Actions, private loginService: LoginService) {
  }
}
