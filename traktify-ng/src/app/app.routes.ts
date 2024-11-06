import {Routes} from '@angular/router';
import {SongTableComponent} from './components/song-table/song-table.component';
import {HomeComponent} from './components/home/home.component';
import {SettingsComponent} from './components/settings/settings.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'playlist/:id', component: SongTableComponent},
  {path: 'settings', component: SettingsComponent}
];
