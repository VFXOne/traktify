import {Pipe, PipeTransform} from '@angular/core';
import {CamelotKey} from '../models/key.model';

@Pipe({
  name: 'keyDisplay',
  standalone: true
})
export class KeyDisplayPipe implements PipeTransform {

  transform(value: CamelotKey | undefined): string {
    if (value != null) {
      return String(value.number) + value.letter;
    } else {
      return '';
    }
  }

}
