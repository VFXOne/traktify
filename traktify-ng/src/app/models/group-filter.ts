import {Playlist} from './playlist.model';

export interface GroupFilter {
  name: string,
  playlistList: Playlist[]
}
