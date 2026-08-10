import {Injectable, signal} from '@angular/core';
import {LoginManagerService} from '../services/login.service';
import {firstValueFrom} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoginService {

  private readonly _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  constructor(private loginService: LoginManagerService) {
  }

  async checkLogin(): Promise<boolean> {
    try {
      this._loading.set(true);
      const isLoggedIn = await firstValueFrom(this.loginService.loadSession());

      this._isLoggedIn.set(isLoggedIn);
      this._loading.set(false);

      return isLoggedIn;
    } catch (error) {
      this._isLoggedIn.set(false);
      this._loading.set(false);

      throw error;
    }
  }

  async logIn(): Promise<void> {
    try {
      this._loading.set(true);

      const loginUrl = await firstValueFrom(this.loginService.loginByRedirect());
      window.location.replace(loginUrl);
    } catch (error) {
      this._loading.set(false);
    }
  }

  async startupLogin(): Promise<void> {
    try {
      await this.checkLogin();
    } catch {
    }
  }

}
