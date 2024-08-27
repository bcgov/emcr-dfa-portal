import { Pipe, PipeTransform } from '@angular/core';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18
import moment from 'moment';

@Pipe({ name: 'customDate' })
export class CustomDate implements PipeTransform {
  transform(value): string {
    if (value !== null && value !== undefined) {
      if (value.length === 10) {
        const dateOfBirth = value;
        const customDateFormat = moment(dateOfBirth, 'MM-DD-YYYY').format(
          'DD-MMM-YYYY'
        );
        return customDateFormat;
      }
    }
  }
}
