import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {LoginService} from '../services/login.service';
import {loginFailure, loginInProgress, loginSuccess} from './actions';
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

  constructor(private actions: Actions, private loginService: LoginService) {
  }
}
