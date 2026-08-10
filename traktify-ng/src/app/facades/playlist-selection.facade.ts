import {computed, Injectable, signal} from '@angular/core';
import {Playlist} from '../models/playlist.model';
import {PlaylistSongs} from '../models/playlist-songs.model';
import {PlaylistService} from '../services/playlist.service';
import {firstValueFrom} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PlaylistSelectionService {
  private _selectedPlaylist = signal<PlaylistSongs | null>(null);

  readonly selectedPlaylist$ = this._selectedPlaylist.asReadonly();
  readonly isPlaylistSelected = computed(() => this._selectedPlaylist !== null);

  constructor(private playlistService: PlaylistService) {
  }

  async selectPlaylist(playlist: Playlist) {
    console.log('Playlist selected ', playlist.name);

    const playlistWithSongs = await firstValueFrom(this.playlistService.getPlaylistSongs(playlist.id));

    this._selectedPlaylist.set(playlistWithSongs);
  }
}
