import { FileIconPipe } from './file-icon.pipe';
import { DirectoryItem } from '../explorer.model';

describe('FileIconPipe', () => {
  let pipe: FileIconPipe;

  beforeEach(() => {
    pipe = new FileIconPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return folder for directory items', () => {
    const item = { IsDir: true } as DirectoryItem;
    expect(pipe.transform(item)).toBe('folder');
  });

  it('should return description for text MIME types', () => {
    const item = { IsDir: false, MimeType: 'text/plain' } as DirectoryItem;
    expect(pipe.transform(item)).toBe('description');
  });

  it('should return image for image MIME types', () => {
    const item = { IsDir: false, MimeType: 'image/png' } as DirectoryItem;
    expect(pipe.transform(item)).toBe('image');
  });

  it('should return audio_file for audio MIME types', () => {
    const item = { IsDir: false, MimeType: 'audio/mpeg' } as DirectoryItem;
    expect(pipe.transform(item)).toBe('audio_file');
  });

  it('should return video_file for video MIME types', () => {
    const item = { IsDir: false, MimeType: 'video/mp4' } as DirectoryItem;
    expect(pipe.transform(item)).toBe('video_file');
  });

  it('should return docs for application document MIME types', () => {
    const pdf = { IsDir: false, MimeType: 'application/pdf' } as DirectoryItem;
    const doc = { IsDir: false, MimeType: 'application/msword' } as DirectoryItem;
    expect(pipe.transform(pdf)).toBe('docs');
    expect(pipe.transform(doc)).toBe('docs');
  });

  it('should return folder_zip for application archive MIME types', () => {
    const zip = { IsDir: false, MimeType: 'application/zip' } as DirectoryItem;
    const gzip = { IsDir: false, MimeType: 'application/gzip' } as DirectoryItem;
    expect(pipe.transform(zip)).toBe('folder_zip');
    expect(pipe.transform(gzip)).toBe('folder_zip');
  });

  it('should return insert_drive_file for other/unknown MIME types', () => {
    const unknown = { IsDir: false, MimeType: 'application/octet-stream' } as DirectoryItem;
    const random = { IsDir: false, MimeType: 'foo/bar' } as DirectoryItem;
    expect(pipe.transform(unknown)).toBe('insert_drive_file');
    expect(pipe.transform(random)).toBe('insert_drive_file');
  });
});
