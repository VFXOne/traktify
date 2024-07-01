import {loginReducer, LoginState} from './reducers';
import {ActionReducer} from '@ngrx/store';
import {LoginEffects} from './effects';

export interface AppState {
  login: LoginState;
}

export interface AppStore {
  login: ActionReducer<LoginState>;
}

export const appStore: AppStore = {
  login: loginReducer
};

export const appEffects = [LoginEffects];
