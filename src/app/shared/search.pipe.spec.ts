import { SearchPipe } from './search.pipe';

describe('SearchPipe', () => {
  let pipe: SearchPipe;

  beforeEach(() => {
    pipe = new SearchPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return original values if searchString is empty', () => {
    const values = [{ name: 'abc' }, { name: 'def' }];
    expect(pipe.transform(values, '', ['name'])).toEqual(values);
  });

  it('should return original values if searchKeys is empty', () => {
    const values = [{ name: 'abc' }, { name: 'def' }];
    expect(pipe.transform(values, 'abc', [])).toEqual(values);
  });

  it('should filter items by subsequence', () => {
    const values = [
      { name: 'rclone' },
      { name: 'random' },
      { name: 'clone' },
      { name: 'google' },
    ];
    expect(pipe.transform(values, 'rc', ['name'])).toEqual([
      { name: 'rclone' },
    ]);

    expect(pipe.transform(values, 'ln', ['name'])).toEqual([
      { name: 'rclone' },
      { name: 'clone' },
    ]);
  });

  it('should support case insensitive matching by default', () => {
    const values = [{ name: 'RClone' }, { name: 'rclone' }];
    expect(pipe.transform(values, 'RC', ['name'])).toEqual([
      { name: 'RClone' },
      { name: 'rclone' },
    ]);
  });

  it('should support case sensitive matching if specified', () => {
    const values = [{ name: 'RClone' }, { name: 'rclone' }];
    expect(pipe.transform(values, 'RC', ['name'], true)).toEqual([
      { name: 'RClone' },
    ]);
  });

  it('should search across multiple keys', () => {
    const values = [
      { name: 'file1', type: 'txt' },
      { name: 'file2', type: 'pdf' },
      { name: 'archive', type: 'zip' },
    ];
    expect(pipe.transform(values, 'zi', ['name', 'type'])).toEqual([
      { name: 'archive', type: 'zip' },
    ]);
    expect(pipe.transform(values, 'fi', ['name', 'type'])).toEqual([
      { name: 'file1', type: 'txt' },
      { name: 'file2', type: 'pdf' },
    ]);
  });
});
