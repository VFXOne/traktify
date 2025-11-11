import { Component } from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {LoginService} from '../../../facades/login.facade';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-service',
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatButton,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginLoading = this.loginService.loading;

  constructor(private loginService: LoginService, private router : Router) {
  }

  login() {
    this.loginService.logIn().then(() => {
      void this.router.navigateByUrl('/home');
    })
  }
}
