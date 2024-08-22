import {Component} from '@angular/core';
import {PlaylistService} from '../../services/playlist.service';
import {MatList, MatListItem} from '@angular/material/list';
import {Playlist} from '../../models/playlist.model';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {AppStore} from '../../store/store';
import {Store} from '@ngrx/store';
import {selectLoggedIn} from '../../store/selectors';
import {NgForOf, NgIf} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-playlist-selector',
  standalone: true,
  imports: [
    MatList,
    MatListItem,
    RouterLinkActive,
    RouterLink,
    MatIcon,
    NgIf,
    NgForOf,
    MatProgressSpinner
  ],
  templateUrl: './playlist-selector.component.html',
  styleUrl: './playlist-selector.component.scss'
})
export class PlaylistSelectorComponent {

  playlists: Playlist[] | undefined;
  loggedIn: boolean = false;
  playlistsLoaded: boolean = true;

  constructor(private store: Store<AppStore>, private playlistService: PlaylistService) {
    this.store.select(selectLoggedIn).subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      if (this.loggedIn) {
        this.loadPlaylists();
      }
    });
  }

  loadPlaylists() {
    this.playlistsLoaded = false;
    this.playlistService.getPlaylists().subscribe(playlists => {
      this.playlists = playlists;
      this.playlistsLoaded = true;
    });
  }

}
