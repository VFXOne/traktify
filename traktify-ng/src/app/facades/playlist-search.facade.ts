import {Injectable, signal} from '@angular/core';
import {Playlist} from '../models/playlist.model';
import {PlaylistService} from '../services/playlist.service';
import {firstValueFrom} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PlaylistSearchService {

  private readonly _playlists = signal<Playlist[]>([]);
  readonly playlists = this._playlists.asReadonly();

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  private readonly _playlistsLoaded = signal<boolean>(false);
  readonly playlistLoaded = this._playlistsLoaded.asReadonly();

  constructor(private playlistService: PlaylistService) {
  }

  async initPlaylists(): Promise<void> {
    if (!this.playlistLoaded()) {
      return this.reloadPlaylists();
    }
  }

  async reloadPlaylists(): Promise<void> {
    this._loading.set(true);

    const playlists = await firstValueFrom(this.playlistService.getPlaylists());
    this._playlists.set(playlists);

    this._loading.set(false);
    this._playlistsLoaded.set(true);
  }

}
