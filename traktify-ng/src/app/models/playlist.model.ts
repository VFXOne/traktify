import {Song} from './song.model';

export interface Playlist {
  name: string,
  id: string,
  songList: Song[] | undefined,
}
