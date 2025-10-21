import {Component} from '@angular/core';
import {PlaylistService} from '../../../services/playlist.service';
import {MatList, MatListItem} from '@angular/material/list';
import {Playlist} from '../../../models/playlist.model';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe, NgForOf} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Observable} from 'rxjs';
import {PlaylistSelectionService} from '../../../facades/playlist-selection.facade';

@Component({
  selector: 'app-playlist-selector',
  standalone: true,
  imports: [
    MatList,
    MatListItem,
    RouterLinkActive,
    RouterLink,
    MatIcon,
    NgForOf,
    MatProgressSpinner,
    AsyncPipe
  ],
  templateUrl: './playlist-selector.component.html',
  styleUrl: './playlist-selector.component.scss'
})
export class PlaylistSelectorComponent {

  currentPlaylists$: Observable<Playlist[]>;

  constructor(playlistService: PlaylistService, private playlistSelection : PlaylistSelectionService) {
    this.currentPlaylists$ = playlistService.getPlaylists();
  }

  selectPlaylist(playlist: Playlist) {
    this.playlistSelection.selectPlaylist(playlist);
  }
}
