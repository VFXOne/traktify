import {Playlist} from './playlist.model';

export interface PlaylistGroup {
  id: string;
  name: string,
  playlists: Playlist[]
}
