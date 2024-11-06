import {PlaylistGroup} from '../models/playlist-group';
import {PLAYLIST_LIST} from './playlist-list';

export const GROUP_LIST: PlaylistGroup[] = [
  {
    name: 'Moods',
    id: '1',
    playlists: PLAYLIST_LIST.slice(0, 2)
  },
  {
    name: 'Mixes',
    id: '2',
    playlists: PLAYLIST_LIST.slice(2, 3)
  }
];
