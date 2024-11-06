import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PlaylistGroup} from '../models/playlist-group';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environment';
import {Playlist} from '../models/playlist.model';

@Injectable({
  providedIn: 'root'
})

export class GroupService {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getGroups(): Observable<PlaylistGroup[]> {
    return this.http.get<PlaylistGroup[]>(this.url + 'groups');
  }

  createGroup(group: PlaylistGroup): Observable<PlaylistGroup> {
    return this.http.post<PlaylistGroup>(this.url + 'groups', group);
  }

  editGroup(group: PlaylistGroup): Observable<boolean> {
    return this.http.put<boolean>(this.url + 'groups/' + group.id, group);
  }

  deleteGroup(group: PlaylistGroup): Observable<boolean> {
    return this.http.delete<boolean>(this.url + 'groups/' + group.id);
  }

  addPlaylistToGroup(group: PlaylistGroup, playlist: Playlist): void {
    this.http.put<boolean>(this.url + 'groups/add_playlist/' + group.id, playlist.id)
      .subscribe({
        error: (err) => console.log(`Error when adding playlist ${playlist.name} to group ${group.name}: ${err}`),
      });
  }

  deletePlaylistFromGroup(group: PlaylistGroup, playlist: Playlist): void {
    this.http.put<boolean>(this.url + 'groups/remove_playlist/' + group.id, playlist.id)
      .subscribe({
        error: (err) => console.log(`Error when removing playlist ${playlist.name} to group ${group.name}: ${err}`),
      });
  }
}
