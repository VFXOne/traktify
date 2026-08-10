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

  getSongByID(songID: string | null): Observable<Song> {
    if (environment.dummyData) {
      let song = SONGLIST.find(s => s.id === songID);
      return new Observable<Song>((observer) => {
        if (song == null) {
          observer.error('Song ID not found');
        } else {
          observer.next(song);
        }
      });
    } else {
      return this.http.get<Song>(this.url + 'song/' + songID)
        .pipe(
          catchError((error) => {
            console.log("[Song service] unable to get songs for playlist " + songID, error);
            return throwError(() => {return new Error('An error occurred with the local server:', error)});
          })
        )
    }
  }
}
