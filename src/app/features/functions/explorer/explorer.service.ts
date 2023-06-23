import { Injectable } from '@angular/core';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { Ok, Result } from 'src/app/shared/result';
import { AppClipboard, DirectoryItem, EmptyObj } from './explorer.model';

@Injectable({
  providedIn: 'root',
})
export class ExplorerService {
  constructor(private rc: RemoteControlService) {}

  async getOsType(): Promise<string> {
    return (await this.rc.call<{ os: string }>('core/version')).orThrow().os;
  }

  async listChildren(
    backend: string,
    path: string
  ): Promise<Result<DirectoryItem[], string>> {
    const result = await this.rc.call<{ list: DirectoryItem[] }>(
      'operations/list',
      {
        fs: ExplorerService.toFs(backend),
        remote: path,
      }
    );
    if (!result.ok) {
      return result;
    }
    return Ok(result.value.list);
  }

  async createEmptyFolder(
    backend: string,
    path: string
  ): Promise<Result<void, string>> {
    const result = await this.rc.call<EmptyObj>('operations/mkdir', {
      fs: ExplorerService.toFs(backend),
      remote: path,
    });
    if (!result.ok) {
      return result;
    }
    return Ok();
  }

  async deleteFile(
    backend: string,
    path: string
  ): Promise<Result<void, string>> {
    const result = await this.rc.call<EmptyObj>('operations/deletefile', {
      fs: ExplorerService.toFs(backend),
      remote: path,
    });
    if (!result.ok) {
      return result;
    }
    return Ok();
  }

  async deleteFolder(
    backend: string,
    path: string
  ): Promise<Result<void, string>> {
    const result = await this.rc.call<EmptyObj>('operations/purge', {
      fs: ExplorerService.toFs(backend),
      remote: path,
    });
    if (!result.ok) {
      return result;
    }
    return Ok();
  }

  deleteItem(
    backend: string,
    item: DirectoryItem
  ): Promise<Result<void, string>> {
    if (item.IsDir) {
      return this.deleteFolder(backend, item.Path);
    } else {
      return this.deleteFile(backend, item.Path);
    }
  }

  renameItem(
    backend: string,
    item: DirectoryItem,
    newName: string
  ): Promise<Result<void, string>> {
    const pathList = item.Path.split('/');
    pathList[pathList.length - 1] = newName;
    const newPath = pathList.join('/');

    if (item.IsDir) {
      return this.rcSync('move', backend, item.Path, backend, newPath);
    } else {
      return this.rcOperate('move', backend, item.Path, backend, newPath);
    }
  }

  async generateLink(
    backend: string,
    path: string
  ): Promise<Result<string, string>> {
    const result = await this.rc.call<{ url: string }>(
      'operations/publiclink',
      {
        fs: ExplorerService.toFs(backend),
        remote: path,
      }
    );
    if (!result.ok) {
      return result;
    }
    return Ok(result.value.url);
  }

  async clipboardOperate(
    backend: string,
    path: string,
    clipboard: AppClipboard
  ): Promise<Result<void, string>[]> {
    return Promise.all(
      clipboard.items.map((item) => {
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
      })
    );
  }

  /**
   * @param action copy or move
   * @param srcFs fs name, without colon
   * @param srcRemote path of file, must be a file, not a directory.
   * @param dstFs fs name, without colon
   * @param dstRemote path of file, must be a file, not a directory.
   * @returns observable may be error
   */
  private async rcOperate(
    action: 'copy' | 'move',
    srcFs: string,
    srcRemote: string,
    dstFs: string,
    dstRemote: string
  ): Promise<Result<void, string>> {
    const result = await this.rc.call<EmptyObj>(`operations/${action}file`, {
      srcFs: ExplorerService.toFs(srcFs),
      srcRemote,
      dstFs: ExplorerService.toFs(dstFs),
      dstRemote,
    });
    if (!result.ok) {
      return result;
    }
    return Ok();
  }

  /**
   * @param action one of [copy, move, sync, bisync]
   * @param srcFs fs name, without colon
   * @param srcRemote  path of file, must be a directory, not a file.
   * @param dstFs fs name, without colon
   * @param dstRemote path of file, must be a directory, not a file.
   * @returns observable may be error
   */
  private async rcSync(
    action: 'copy' | 'move' | 'sync' | 'bisync',
    srcFs: string,
    srcRemote: string,
    dstFs: string,
    dstRemote: string
  ): Promise<Result<void, string>> {
    const result = await this.rc.call<EmptyObj>('sync/' + action, {
      srcFs: ExplorerService.toFs(srcFs) + srcRemote,
      dstFs: ExplorerService.toFs(dstFs) + dstRemote,
    });
    if (!result.ok) {
      return result;
    }
    return Ok();
  }

  private static toFs(backend: string) {
    if (backend === '') {
      return '/';
    } else {
      return backend + ':';
    }
  }
}
