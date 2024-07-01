import {Component} from '@angular/core';
import {PlaylistService} from '../../services/playlist.service';
import {MatList, MatListItem} from '@angular/material/list';
import {Playlist} from '../../models/playlist.model';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {AppStore} from '../../store/store';
import {Store} from '@ngrx/store';
import {selectLoggedIn} from '../../store/selectors';

@Component({
  selector: 'app-playlist-selector',
  standalone: true,
  imports: [
    MatList,
    MatListItem,
    RouterLinkActive,
    RouterLink,
    MatIcon
  ],
  templateUrl: './playlist-selector.component.html',
  styleUrl: './playlist-selector.component.scss'
})
export class PlaylistSelectorComponent {

  playlists: Playlist[] | undefined;
  loggedIn: boolean = false;

  constructor(private store: Store<AppStore>, private playlistService: PlaylistService) {
    this.store.select(selectLoggedIn).subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      console.log('[playlist service] loggedIn: ' + this.loggedIn);
      if (this.loggedIn) {
        this.loadPlaylists();
      }
    });
  }

  loadPlaylists() {
    this.playlistService.getPlaylists().subscribe(playlists => {
      this.playlists = playlists;
    });
  }

}
