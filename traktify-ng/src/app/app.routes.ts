import {Routes} from '@angular/router';
import {SongTableComponent} from './components/song-table/song-table.component';
import {HomeComponent} from './components/containers/home/home.component';
import {SettingsComponent} from './components/containers/settings/settings.component';
import {authenticationGuard} from './guards/authenticationGuard';
import {LoginComponent} from './components/containers/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    canActivateChild: [authenticationGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'playlist/:id',
        component: SongTableComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },

    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
