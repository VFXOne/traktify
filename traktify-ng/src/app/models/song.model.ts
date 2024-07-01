import {Artist} from './artist.model';
import {CamelotKey} from './key.model';

export interface Song {
  index: number;
  name: string;
  id: string;
  artists : Artist[];
  // --- Song info/metadata
  duration_ms: number;
  key: CamelotKey;
  tempo: number;
  acousticness: number;
  danceability: number;
  energy: number;
  valence: number;
}
