import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import {
  AppClipboard,
  DirectoryItem,
  EmptyObj,
  ExplorerView,
} from './explorer.model';

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

  listChildren(view: ExplorerView) {
    const { backend, path } = view;
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

  clipboardOperate(backend: string, path: string, clipboard: AppClipboard) {
    return clipboard.items.map((item) => {
      if (item.IsDir) {
        return this.rcSync(
          clipboard.type,
          clipboard.backend,
          item.Path,
          backend,
          path
        );
      } else {
        return this.rcOperate(
          clipboard.type,
          clipboard.backend,
          item.Path,
          backend,
          path
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
