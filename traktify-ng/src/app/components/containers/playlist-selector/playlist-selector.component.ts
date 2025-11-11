import {Component, OnInit} from '@angular/core';
import {MatList, MatListItem} from '@angular/material/list';
import {Playlist} from '../../../models/playlist.model';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {NgForOf} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PlaylistSelectionService} from '../../../facades/playlist-selection.facade';
import {LoginService} from '../../../facades/login.facade';
import {PlaylistSearchService} from '../../../facades/playlist-search.facade';

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
    MatProgressSpinner
  ],
  templateUrl: './playlist-selector.component.html',
  styleUrl: './playlist-selector.component.scss'
})
export class PlaylistSelectorComponent implements OnInit {

  playlistsLoading = this.playlistService.loading;
  currentPlaylists = this.playlistService.playlists;

  isLoggedIn = this.loginService.isLoggedIn;

  constructor(private playlistService: PlaylistSearchService, private playlistSelection: PlaylistSelectionService, private loginService: LoginService) {
  }

  ngOnInit(): void {
    void this.playlistService.initPlaylists();
  }

  selectPlaylist(playlist: Playlist) {
    this.playlistSelection.selectPlaylist(playlist);
  }
}
