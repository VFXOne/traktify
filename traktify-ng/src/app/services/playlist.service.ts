import {Injectable} from '@angular/core';
import {PLAYLIST_LIST, PLAYLIST_SONGS_LIST} from '../test-data/playlist-list';
import {Playlist} from '../models/playlist.model';
import {catchError, Observable, of, throwError} from 'rxjs';
import {environment} from '../environment';
import {HttpClient} from '@angular/common/http';
import {PlaylistSongs} from '../models/playlist-songs.model';
import {SpotifyPlaylist} from '../models/playlist-spotify.model';

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
      return this.http.get<Playlist[]>(this.url + 'emptyPlaylists')
        .pipe(
          catchError((error) => {
            console.log('API Error: ', error);
            return throwError(() => {return new Error('An error occurred with the local server:', error)});
          })
        );
    }
  }

  getPlaylistSongs(playlistId : string): Observable<PlaylistSongs> {
    if (environment.dummyData) {
      return of(PLAYLIST_SONGS_LIST.find(p => p.id == playlistId)!);
    } else {
      return this.http.get<PlaylistSongs>(this.url + 'playlistSongs/' + playlistId)
    }
  }

  getSpotifyPlaylists(): Observable<SpotifyPlaylist[]> {
    return this.http.get<SpotifyPlaylist[]>(this.url + 'spotifyPlaylists')
  }

  syncPlaylist(playlistId: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + 'syncPlaylist/' + playlistId, playlistId);
  }

  unsyncPlaylist(playlistId: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + 'unsyncPlaylist/' + playlistId, playlistId);
  }
}
