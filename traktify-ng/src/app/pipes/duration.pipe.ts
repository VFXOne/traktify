import {Pipe, PipeTransform} from '@angular/core';
import {formatDate} from '@angular/common';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  transform(value: number | undefined): string {
    if (value != null) {
      let tempDate = new Date(0, 0, 0);
      tempDate.setMilliseconds(value);
      return formatDate(tempDate, "mm:ss", "en-US");
    } else {
      return "-"
    }
  }
}
