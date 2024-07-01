import {Pipe, PipeTransform} from '@angular/core';
import {Artist} from '../models/artist.model';

@Pipe({
  name: 'artistsDisplay',
  standalone: true
})
export class ArtistsDisplayPipe implements PipeTransform {

  transform(value: Artist[] | undefined): string {
    if (value != null) {
      return value.map(a => a.name).join(', ');
    } else {
      return '';
    }
  }

}
