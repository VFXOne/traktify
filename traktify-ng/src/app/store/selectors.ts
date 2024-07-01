import {createSelector} from '@ngrx/store';

const selectLogin = (state: any) => state.login;

export const selectLoading = createSelector(
  selectLogin,
  (state) => state.loading
)
export const selectUsername = createSelector(
  selectLogin,
  (state) => state.username
)
export const selectError = createSelector(
  selectLogin,
  (state) => state.error
)
export const selectLoggedIn = createSelector(
  selectLogin,
  (state) => state.loggedIn
)
