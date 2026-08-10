import {Song} from './song.model';

export interface PlaylistSongs {
  name: string,
  id: string,
  songList: Song[],
}
