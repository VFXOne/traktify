import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {AppStore} from '../../store/store';
import {Store} from '@ngrx/store';
import {loginInProgress} from '../../store/actions';
import {NgIf} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {selectError, selectLoading, selectUsername} from '../../store/selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButton,
    NgIf,
    MatProgressSpinner
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  loginLoading: boolean = false;
  return: string = '';

  constructor(private store: Store<AppStore>) {
    this.store.select(selectLoading).subscribe(isLoading => this.loginLoading = isLoading);
    this.store.select(selectUsername).subscribe(username => this.return = username);
    this.store.select(selectError).subscribe(error => this.return = error);
  }

  login() {
    this.store.dispatch(loginInProgress());
  }
}
