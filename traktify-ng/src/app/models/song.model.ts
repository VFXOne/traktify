import {Artist} from './artist.model';
import {AudioInfo} from './audio-info.model';

export interface Song {
  index: number;
  name: string;
  id: string;
  artists : Artist[];
  duration_ms: number;
  audioInfo: AudioInfo;
}
