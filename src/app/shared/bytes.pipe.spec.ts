import { BytesPipe } from './bytes.pipe';

describe('BytesPipe', () => {
  let pipe: BytesPipe;

  beforeEach(() => {
    pipe = new BytesPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format bytes with default settings (1024, IEC=true, 2 fraction digits)', () => {
    expect(pipe.transform(0)).toBe('0.00 B');
    expect(pipe.transform(500)).toBe('500.00 B');
    expect(pipe.transform(1024)).toBe('1.00 KiB');
    expect(pipe.transform(1024 * 1024)).toBe('1.00 MiB');
    expect(pipe.transform(1024 * 1024 * 5.5)).toBe('5.50 MiB');
    expect(pipe.transform(1024 * 1024 * 1024)).toBe('1.00 GiB');
  });

  it('should support custom fraction digits', () => {
    expect(pipe.transform(1024, 0)).toBe('1 KiB');
    expect(pipe.transform(1024 * 1024 * 5.546, 1)).toBe('5.5 MiB');
    expect(pipe.transform(1024 * 1024 * 5.546, 3)).toBe('5.546 MiB');
  });

  it('should support base 1000 (KB, MB, etc.)', () => {
    expect(pipe.transform(1000, 2, 1000)).toBe('1.00 KB');
    expect(pipe.transform(1000000, 2, 1000)).toBe('1.00 MB');
  });

  it('should support IEC=false with base 1024 (KB, MB, etc.)', () => {
    expect(pipe.transform(1024, 2, 1024, false)).toBe('1.00 KB');
    expect(pipe.transform(1024 * 1024, 2, 1024, false)).toBe('1.00 MB');
  });
});
