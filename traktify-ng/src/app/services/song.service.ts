import {Injectable} from '@angular/core';
import {Song} from '../models/song.model';
import {SONGLIST} from '../test-data/song-list';
import {catchError, Observable, throwError} from 'rxjs';
import {environment} from '../environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class SongService {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getSongsFromPlaylist(playlistID: string): Observable<Song[]> {
    if (environment.dummyData) {
      return new Observable<Song[]>((subscriber) => {
        if (playlistID === '88888') {
          subscriber.next(SONGLIST.slice(0, 2));
        } else {
          subscriber.next(SONGLIST.slice(1, 2));
        }
      });
    } else {
      return this.http.get<Song[]>(this.url + 'songs/' + playlistID)
        .pipe(
          catchError((error) => {
            console.log("[Song service] unable to get songs for playlist " + playlistID, error);
            return throwError(() => {return new Error('An error occurred with the local server:', error)});
          })
        )
    }
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
