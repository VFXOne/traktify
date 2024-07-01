import {Injectable} from '@angular/core';
import {Song} from '../models/song.model';
import {SONGLIST} from '../test-data/song-list';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SongService {

  constructor() {
  }

  getSongsFromPlaylist(playlistID: string): Observable<Song[]> {
    return new Observable<Song[]>((subscriber) => {
      if (playlistID === '88888') {
        subscriber.next(SONGLIST.slice(0,2));
      } else {
        subscriber.next(SONGLIST.slice(1,2));
      }
    });
  }

  getSongByID(id: string | null): Observable<Song> {
    let song = SONGLIST.find(s => s.id === id);
    return new Observable<Song>((observer) => {
      if (song == null) {
        observer.error('Song ID not found');
      } else {
        observer.next(song);
      }
    });
  }

}
