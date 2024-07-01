import { Song } from '../models/song.model';

describe('Song', () => {
  it('should create an instance', () => {
    expect(new Song()).toBeTruthy();
  });
});
