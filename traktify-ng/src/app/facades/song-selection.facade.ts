import {computed, Injectable, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {Song} from '../models/song.model';
import {SongService} from '../services/song.service';

@Injectable({providedIn: 'root'})
export class SongSelectionService {
  private _selectedSong = signal<Song | null>(null);

  readonly selectedSong$ = this._selectedSong;
  readonly isSongSelected = computed(() => this._selectedSong !== null);

  constructor(private songService: SongService) {
  }

  selectSong(song: Song): void {
    this._selectedSong.set(song);
  }

  async selectSongByID(songID: string): Promise<void> {
    const song = await firstValueFrom(this.songService.getSongByID(songID));
    this._selectedSong.set(song);
    console.log('Selected Song :', song.name);
  }
}
