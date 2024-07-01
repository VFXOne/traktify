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
    acousticness: 0,
    danceability: 46,
    duration_ms: 345000,
    energy: 79,
    key: {
      number: 6,
      letter: 'B',
      major: true,
    },
    tempo: 142,
    valence: 0
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
    acousticness: 1,
    danceability: 36,
    duration_ms: 236000,
    energy: 89,
    key: {
      number: 4,
      letter: 'B',
      major: false
    },
    tempo: 95,
    valence: 0
  }
]
