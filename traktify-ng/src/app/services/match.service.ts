import {Injectable} from '@angular/core';
import {Song} from '../models/song.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environment';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getSongsMatching(songID: string, playlistsIDs: string[]): Observable<Song[]> {
    return this.http.put<Song[]>(this.url + 'match/' + songID, playlistsIDs);
  }
}
