import {createReducer, on} from '@ngrx/store';
import {loginInProgress, loginFailure, loginSuccess} from './actions';

export interface LoginState {
  loggedIn: boolean;
  username: string;
  error: string | undefined;
  loading: boolean;
}

export const initialLoginState: LoginState = {
  loggedIn: false,
  username: '',
  error: undefined,
  loading: false,
};

export const loginReducer = createReducer(
  initialLoginState,
  on(loginInProgress, state => ({...state, loading: true, loggedIn: false})),
  on(loginSuccess, (state, {username}) => ({...state, loading: false, error: undefined, username, loggedIn: true})),
  on(loginFailure, (state, {error}) => ({...state, loading: false, error, loggedIn: false})),
);
