import {Injectable, signal} from '@angular/core';
import {GroupService} from '../services/group.service';
import {PlaylistGroup} from '../models/playlist-group';
import {firstValueFrom} from 'rxjs';
import {Playlist} from '../models/playlist.model';

@Injectable({providedIn: 'root'})
export class GroupEditingService {

  private readonly _groups = signal<PlaylistGroup[]>([]);
  readonly groups = this._groups.asReadonly();

  private _loading = signal<boolean>(true);
  readonly loading = this._loading.asReadonly();

  constructor(private groupService: GroupService) {
  }

   loadGroups(): void {
    this._loading.set(true);

    this.groupService.getGroups().subscribe({
      next: groups => this._groups.set(groups),
      error: error => console.log(error),
      complete: () => this._loading.set(false),
    });
  }

  async createGroup(newName: string): Promise<void> {
    try {
      const newGroup = await firstValueFrom(this.groupService.createGroup({
        id: '',
        name: newName,
        playlists: []
      }));
      this._groups.update(groupList => [...groupList, newGroup]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async renameGroup(group: PlaylistGroup): Promise<void> {
    try {
      const ok = await firstValueFrom(this.groupService.editGroup(group));
      if (ok) {
        this._groups.update(groupList => groupList.map(g => g.id === group.id ? group : g));
      } else {
        throw new Error('Group was not updated');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteGroup(group: PlaylistGroup): Promise<void> {
    try {
      const ok = await firstValueFrom(this.groupService.deleteGroup(group));
      if (ok) {
        this._groups.update(groupList => groupList.filter(g => g.id !== group.id));
      } else {
        throw new Error('Group was not deleted');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addPlaylistToGroup(newPlaylist: Playlist, group: PlaylistGroup): Promise<void> {
    try {
      this.groupService.addPlaylistToGroup(group, newPlaylist);
      group.playlists.push(newPlaylist);
      this._groups.update(groupList => groupList.map(g => g.id === group.id ? group : g));

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async removePlaylistFromGroup(removedPlaylist: Playlist, group: PlaylistGroup): Promise<void> {
    try {
      this.groupService.deletePlaylistFromGroup(group, removedPlaylist);
      group.playlists.filter(p => p.id !== removedPlaylist.id);
      this._groups.update(groupList => groupList.map(g => g.id === group.id ? group : g));

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}
