import {Injectable} from '@angular/core';
import {Song} from '../models/song.model';
import {Observable} from 'rxjs';
import {SONGLIST} from '../test-data/song-list';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor() {
  }

  getSonsMatching(songID: string, playlistsIDs: string[]): Observable<Song[]> {
    return new Observable<Song[]>(subscriber => {
      subscriber.next(SONGLIST);
    });
  }
}
