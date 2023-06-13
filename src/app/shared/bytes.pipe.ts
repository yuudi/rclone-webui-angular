import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytes',
})
export class BytesPipe implements PipeTransform {
  transform(
    value: number,
    fractionDigits = 2,
    base: 1024 | 1000 = 1024,
    IEC = true
  ): string {
    const units =
      IEC && base === 1024
        ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        : ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let unit = 0;
    while (value >= base && unit < units.length - 1) {
      value /= base;
      unit++;
    }
    return `${value.toFixed(fractionDigits)} ${units[unit]}`;
  }
}
