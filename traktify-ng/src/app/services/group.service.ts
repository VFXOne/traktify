import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {GroupFilter} from '../models/group-filter';
import {GROUP_LIST} from '../test-data/group-list';

@Injectable({
  providedIn: 'root'
})

export class GroupService {
  constructor() {
  }

  getGroups(): Observable<GroupFilter[]> {
    return of(GROUP_LIST);
  }
}
