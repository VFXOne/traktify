import {Routes} from '@angular/router';
import {SongTableComponent} from './components/song-table/song-table.component';
import {HomeComponent} from './components/containers/home/home.component';
import {SettingsComponent} from './components/containers/settings/settings.component';
import {authenticationGuard} from './guards/authenticationGuard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authenticationGuard]

  },
  {
    path: 'playlist/:id',
    component: SongTableComponent,
    canActivate: [authenticationGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authenticationGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
