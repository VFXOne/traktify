import {Playlist} from '../models/playlist.model';
import {PlaylistSongs} from '../models/playlist-songs.model';

export const PLAYLIST_LIST: Playlist[] = [
  {
    name: 'Favorites',
    id: '88888',
  },
  {
    name: 'Liked songs',
    id: '789',
  },
  {
    name: 'Mix House',
    id: '1234',
  }
]

export const PLAYLIST_SONGS_LIST: PlaylistSongs[] = [
  {
    name: 'Favorites',
    id: '88888',
    songList: []
  },
  {
    name: 'Liked songs',
    id: '789',
    songList: []
  },
  {
    name: 'Mix House',
    id: '1234',
    songList: []
  }
]
