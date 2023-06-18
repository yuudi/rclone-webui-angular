import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform<V extends { [key in K]: string }, K extends string>(
    values: V[],
    searchString: string,
    searchKeys: K[],
    caseSensitive = false
  ): V[] {
    if (!searchString) {
      return values;
    }
    if (searchKeys.length === 0) {
      return values;
    }
    return values.filter((v) =>
      searchKeys.some((key) =>
        SearchPipe.isSubSequence(searchString, v[key], caseSensitive)
      )
    );
  }

  private static isSubSequence(
    sub: string,
    str: string,
    caseSensitive = false
  ): boolean {
    if (!caseSensitive) {
      sub = sub.toLowerCase();
      str = str.toLowerCase();
    }
    let j = 0;
    for (let i = 0; i < str.length && j < sub.length; i++) {
      if (sub[j] === str[i]) {
        j++;
      }
    }
    return j === sub.length;
  }
}
