import {PlaylistGroup} from '../models/playlist-group';
import {PLAYLIST_LIST} from './playlist-list';

export const GROUP_LIST: PlaylistGroup[] = [
  {
    name: 'Moods',
    playlistList: PLAYLIST_LIST.slice(0, 2)
  },
  {
    name: 'Mixes',
    playlistList: PLAYLIST_LIST.slice(2, 3)
  }
];
