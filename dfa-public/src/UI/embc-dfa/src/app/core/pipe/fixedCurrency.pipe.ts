import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixedCurrency',
  standalone: true,
})
export class FixedCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined, symbol: string = '$'): string {
    if (value == null || isNaN(value)) return `${symbol} 0.00`;

    const formatted = new Intl.NumberFormat('en-CA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    }).format(value);

    return `${symbol} ${formatted}`;
  }
}
