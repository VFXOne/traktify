import {GroupFilter} from '../models/group-filter';
import {PLAYLIST_LIST} from './playlist-list';

export const GROUP_LIST: GroupFilter[] = [
  {
    name: 'Moods',
    playlistList: PLAYLIST_LIST.slice(0, 2)
  },
  {
    name: 'Mixes',
    playlistList: PLAYLIST_LIST.slice(2, 3)
  }
];
