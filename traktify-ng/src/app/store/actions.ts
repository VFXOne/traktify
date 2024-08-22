import {createAction, props} from '@ngrx/store';

export const loginInProgress = createAction(
  '[Login] Do Login'
);

export const checkLogin  = createAction(
  '[Login] Check Login'
);

export const loginSuccess = createAction(
  '[Login] Login done!',
  props<{username: string}>()
);

export const loginFailure = createAction(
  '[Login] Login failed',
  props<{error: string}>()
);
