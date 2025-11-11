import {Routes} from '@angular/router';
import {SongTableComponent} from './components/song-table/song-table.component';
import {HomeComponent} from './components/containers/home/home.component';
import {SettingsComponent} from './components/containers/settings/settings.component';
import {authenticationGuard} from './guards/authenticationGuard';
import {LoginComponent} from './components/containers/login/login.component';
import {SetupComponent} from './components/setup/setup.component';
import {setupGuard} from './guards/setupGuard';

export const routes: Routes = [
  {
    path: 'setup',
    component: SetupComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [setupGuard]
  },
  {
    path: '',
    canActivateChild: [authenticationGuard, setupGuard],
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
