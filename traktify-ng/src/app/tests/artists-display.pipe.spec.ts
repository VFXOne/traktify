import { ArtistsDisplayPipe } from '../pipes/artists-display.pipe';

describe('ArtistsDisplayPipe', () => {
  it('create an instance', () => {
    const pipe = new ArtistsDisplayPipe();
    expect(pipe).toBeTruthy();
  });
});
