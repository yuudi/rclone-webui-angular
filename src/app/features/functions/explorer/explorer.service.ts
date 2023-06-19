import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { AppClipboard, DirectoryItem, EmptyObj } from './explorer.model';

@Injectable({
  providedIn: 'root',
})
export class ExplorerService {
  constructor(private rc: RemoteControlService) {}

  getOsType() {
    return this.rc
      .call<{ os: string }>('core/version')
      .pipe(map((res) => res.os));
  }

  listChildren(backend: string, path: string) {
    return this.rc.call<{ list: DirectoryItem[] }>('operations/list', {
      fs: ExplorerService.toFs(backend),
      remote: path,
    });
  }

  deleteFile(backend: string, path: string) {
    return this.rc.call<EmptyObj>('operations/deletefile', {
      fs: ExplorerService.toFs(backend),
      remote: path,
    });
  }

  deleteFolder(backend: string, path: string) {
    return this.rc.call<EmptyObj>('operations/purge', {
      fs: ExplorerService.toFs(backend),
      remote: path,
    });
  }

  deleteItem(backend: string, item: DirectoryItem) {
    if (item.IsDir) {
      return this.deleteFolder(backend, item.Path);
    } else {
      return this.deleteFile(backend, item.Path);
    }
  }

  renameItem(backend: string, item: DirectoryItem, newName: string) {
    const pathList = item.Path.split('/');
    pathList[pathList.length - 1] = newName;
    const newPath = pathList.join('/');

    if (item.IsDir) {
      return this.rcSync('move', backend, item.Path, backend, newPath);
    } else {
      return this.rcOperate('move', backend, item.Path, backend, newPath);
    }
  }

  generateLink(backend: string, path: string) {
    return this.rc
      .call<{ url: string }>('operations/publiclink', {
        fs: ExplorerService.toFs(backend),
        remote: path,
      })
      .pipe(map((res) => res.url));
  }

  clipboardOperate(backend: string, path: string, clipboard: AppClipboard) {
    return clipboard.items.map((item) => {
      if (item.IsDir) {
        const dirName = item.Path.split('/').pop();
        return this.rcSync(
          clipboard.type,
          clipboard.backend,
          item.Path,
          backend,
          path + '/' + dirName
        );
      } else {
        const fileName = item.Path.split('/').pop();
        return this.rcOperate(
          clipboard.type,
          clipboard.backend,
          item.Path,
          backend,
          path + '/' + fileName
        );
      }
    });
  }

  /**
   * @param action copy or move
   * @param srcFs fs name, without colon
   * @param srcRemote path of file, must be a file, not a directory.
   * @param dstFs fs name, without colon
   * @param dstRemote path of file, must be a file, not a directory.
   * @returns observable may be error
   */
  private rcOperate(
    action: 'copy' | 'move',
    srcFs: string,
    srcRemote: string,
    dstFs: string,
    dstRemote: string
  ) {
    return this.rc.call<EmptyObj>(`operations/${action}file`, {
      srcFs: ExplorerService.toFs(srcFs),
      srcRemote,
      dstFs: ExplorerService.toFs(dstFs),
      dstRemote,
    });
  }

  /**
   * @param action one of [copy, move, sync, bisync]
   * @param srcFs fs name, without colon
   * @param srcRemote  path of file, must be a directory, not a file.
   * @param dstFs fs name, without colon
   * @param dstRemote path of file, must be a directory, not a file.
   * @returns observable may be error
   */
  private rcSync(
    action: 'copy' | 'move' | 'sync' | 'bisync',
    srcFs: string,
    srcRemote: string,
    dstFs: string,
    dstRemote: string
  ) {
    return this.rc.call<EmptyObj>('sync/' + action, {
      srcFs: ExplorerService.toFs(srcFs) + srcRemote,
      dstFs: ExplorerService.toFs(dstFs) + dstRemote,
    });
  }

  private static toFs(backend: string) {
    if (backend === '') {
      return '/';
    } else {
      return backend + ':';
    }
  }
}
