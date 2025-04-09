import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneFormat', standalone: false })
export class PhoneFormatPipe implements PipeTransform {

  transform(number: string) {
    if (number.length != 10) return number;

    return number.substring(0,3)+"-"+number.substring(3,6)+"-"+number.substring(7,10);
  }

}
