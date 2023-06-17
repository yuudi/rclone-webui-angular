import { Pipe, PipeTransform } from '@angular/core';

import { AppClipboard } from './explorer.model';

@Pipe({
  name: 'filesSummary',
})
export class FilesSummaryPipe implements PipeTransform {
  transform(value: AppClipboard): string {
    if (value.items.length === 0) {
      return $localize`No files selected`;
    }
    if (value.items.length === 1) {
      return $localize`${this.fileName(value.items[0].Path)} in ${
        value.backend
      }`;
    }
    return $localize`${value.items.length} files in ${value.backend}`;
  }

  private fileName(path: string): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return path.split('/').pop()!;
  }
}
