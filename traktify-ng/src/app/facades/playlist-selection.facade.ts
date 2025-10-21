import {computed, Injectable, signal} from '@angular/core';
import {Playlist} from '../models/playlist.model';
import {SongService} from '../services/song.service';

@Injectable({providedIn: 'root'})
export class PlaylistSelectionService {
  private _selectedPlaylist = signal<Playlist | null>(null);

  readonly selectedPlaylist$ = this._selectedPlaylist;
  readonly isPlaylistSelected = computed(() => this._selectedPlaylist !== null);

  constructor(private songService: SongService) {
  }

  selectPlaylist(playlist: Playlist) {
    console.log('Playlist selected ', playlist.name);
    if (playlist.songList == null) {
      this.songService.getSongsFromPlaylist(playlist.id)
        .subscribe(songs => {
          playlist.songList = songs;
          this._selectedPlaylist.set(playlist);
        });
    } else {
      this._selectedPlaylist.set(playlist);
    }
  }
}
