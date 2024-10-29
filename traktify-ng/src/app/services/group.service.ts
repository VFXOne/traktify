import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {PlaylistGroup} from '../models/playlist-group';
import {GROUP_LIST} from '../test-data/group-list';

@Injectable({
  providedIn: 'root'
})

export class GroupService {
  constructor() {
  }

  getGroups(): Observable<PlaylistGroup[]> {
    return of(GROUP_LIST);
  }
}
