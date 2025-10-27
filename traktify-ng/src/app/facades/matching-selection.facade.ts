import {Injectable, signal} from '@angular/core';
import {Playlist} from '../models/playlist.model';
import {MatchService} from '../services/match.service';
import {Song} from '../models/song.model';
import {firstValueFrom} from 'rxjs';

@Injectable({providedIn: 'root'})
export class MatchingSelectionService {
  private _matchedSongs = signal<Song[] | null>(null);

  readonly matchedSongs = this._matchedSongs.asReadonly();

  constructor(private matchingService: MatchService) {
  }

  async getMatchingSongs(song: Song, playlists: Playlist[]): Promise<void> {
    const matchedSongs = await firstValueFrom(
      this.matchingService.getSongsMatching(
        song.id,
        playlists.map(p => p.id)
      )
    );
    console.log('Matching songs for ' + song.name + ' : ' + matchedSongs.map(p => p.name).join(', '));
    this._matchedSongs.set(matchedSongs);
  }

  resetMatchingSongs(): void {
    this._matchedSongs.set(null);
  }
}
