import {Injectable, signal} from '@angular/core';
import {SpotifyPlaylist} from '../models/playlist-spotify.model';
import {PlaylistService} from '../services/playlist.service';
import {firstValueFrom} from 'rxjs';
import {PlaylistSearchService} from './playlist-search.facade';
import {GroupEditingService} from './group-editing.facade';

@Injectable({providedIn: 'root'})
export class PlaylistSynchronizationFacade {

  private readonly _spotifyPlaylists = signal<SpotifyPlaylist[]>([]);
  readonly spotifyPlaylists = this._spotifyPlaylists.asReadonly();

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  constructor(private playlistService: PlaylistService, private playlistSearchFacade: PlaylistSearchService, private groupService: GroupEditingService) {
  }

  async initSpotifyPlaylists(): Promise<void> {
    if (this._spotifyPlaylists().length === 0) {
      this._loading.set(true);

      const playlists = await firstValueFrom(this.playlistService.getSpotifyPlaylists());
      this._spotifyPlaylists.set(playlists);

      this._loading.set(false);
    }
  }

  async synchronizeSpotifyPlaylist(playlistId: string): Promise<boolean> {
    const result = await firstValueFrom(this.playlistService.syncPlaylist(playlistId));
    this.reloadSideServices();
    return result;
  }

  async unsynchronizeSpotifyPlaylist(playlistId: string): Promise<boolean> {
    const result = await firstValueFrom(this.playlistService.unsyncPlaylist(playlistId));
    this.reloadSideServices();
    return result;
  }

  private reloadSideServices() {
    void this.playlistSearchFacade.reloadPlaylists();
    void this.groupService.loadGroups();
  }
}
