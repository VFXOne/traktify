import {Injectable} from '@angular/core';
import {PLAYLIST_LIST} from '../test-data/playlist-list';
import {Playlist} from '../models/playlist.model';
import {catchError, Observable, of, throwError} from 'rxjs';
import {environment} from '../environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PlaylistService {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getPlaylists(): Observable<Playlist[]> {
    if (environment.dummyData) {
      return of(PLAYLIST_LIST);
    } else {
      return this.http.get<Playlist[]>(this.url + 'playlists')
        .pipe(
          catchError((error) => {
            console.log('API Error: ', error);
            return throwError(() => {return new Error('An error occurred with the local server:', error)});
          })
        )
    }
  }
}
