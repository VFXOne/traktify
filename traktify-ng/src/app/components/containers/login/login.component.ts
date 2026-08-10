import {Component} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton} from '@angular/material/button';
import {LoginService} from '../../../facades/login.facade';

@Component({
  selector: 'app-login-service',
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginLoading = this.loginService.loading;
  isLoggedIn = this.loginService.isLoggedIn;

  constructor(private loginService: LoginService) {
  }

  login() {
    void this.loginService.logIn();
  }
}
