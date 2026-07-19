import { Pipe, PipeTransform } from '@angular/core';
import { DirectoryItem } from '../explorer.model';

@Pipe({
  name: 'fileIcon',
})
export class FileIconPipe implements PipeTransform {
  transform(value: DirectoryItem): string {
    if (value.IsDir) {
      return 'folder';
    }
    const mimeParts = value.MimeType.split('/');
    switch (mimeParts[0]) {
      case 'text':
        return 'description';
      case 'image':
        return 'image';
      case 'audio':
        return 'audio_file';
      case 'video':
        return 'video_file';
      case 'application':
        switch (mimeParts[1]) {
          case 'msword':
          case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
          case 'vnd.ms-powerpoint':
          case 'vnd.openxmlformats-officedocument.presentationml.presentation':
          case 'vnd.ms-excel':
          case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          case 'pdf':
            return 'docs';
          case 'zip':
          case 'x-bzip':
          case 'x-bzip2':
          case 'x-tar':
          case 'gzip':
          case 'x-gzip':
          case 'vnd.rar':
          case 'x-7z-compressed':
            return 'folder_zip';
          case 'octet-stream':
            return 'insert_drive_file';
          default:
            return 'insert_drive_file';
        }
      default:
        return 'insert_drive_file';
    }
  }
}
