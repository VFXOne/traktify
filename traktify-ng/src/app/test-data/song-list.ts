import { Song } from '../models/song.model';

export const SONGLIST: Song[] = [
  {
    index: 1,
    name: 'Falling Away - MitiS Remix',
    id: '123456',
    artists: [
      {
        name: 'Seven Lions'
      },
      {
        name: 'MitiS'
      }
    ],
    audioInfo: {
      acousticness: 0,
      danceability: 46,
      camelotKey: '6B',
      energy: 79,
      valence: 0,
      tempo: 142
    },
    duration_ms: 345000,
  },
  {
    index: 2,
    name: 'Overcompensate',
    id: '321654',
    artists: [
      {
        name: 'Twenty One Pilots'
      }
    ],
    audioInfo: {
      acousticness: 1,
      danceability: 36,
      camelotKey: '4B',
      energy: 89,
      valence: 0,
      tempo: 95
    },
    duration_ms: 236000,
  }
]
