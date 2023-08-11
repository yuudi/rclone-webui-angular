import { Injectable } from '@angular/core';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { Ok, Result } from 'src/app/shared/result';
import { JobID, JobService } from '../job/job.service';
import { AppClipboard, DirectoryItem, EmptyObj } from './explorer.model';

@Injectable({
  providedIn: 'root',
})
export class ExplorerService {
  constructor(
    private rc: RemoteControlService,
    private jobService: JobService,
  ) {}

  async getOsType(): Promise<string> {
    return (await this.rc.call<{ os: string }>('core/version')).orThrow().os;
  }

  async listChildren(
    backend: string,
    path: string,
  ): Promise<Result<DirectoryItem[], string>> {
    const result = await this.rc.call<{ list: DirectoryItem[] }>(
      'operations/list',
      {
        fs: ExplorerService.toFs(backend),
        remote: path,
      },
    );
    if (!result.ok) {
      return result;
    }
    return Ok(result.value.list);
  }

  async createEmptyFolder(
    backend: string,
    path: string,
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

  uploadSmallFile(
    backend: string,
    path: string,
    file: File,
  ): Promise<Result<EmptyObj, string>> {
    const fs = encodeURIComponent(ExplorerService.toFs(backend));
    const remote = encodeURIComponent(path);
    const form = new FormData();
    form.append('file', file);
    // backend behavior does not match documentations
    return this.rc.call<EmptyObj>(
      `operations/uploadfile?fs=${fs}&remote=${remote}`,
      form,
    );
  }

  async deleteFile(
    backend: string,
    path: string,
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
    path: string,
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
    item: DirectoryItem,
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
    newName: string,
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
    path: string,
  ): Promise<Result<string, string>> {
    const result = await this.rc.call<{ url: string }>(
      'operations/publiclink',
      {
        fs: ExplorerService.toFs(backend),
        remote: path,
      },
    );
    if (!result.ok) {
      return result;
    }
    return Ok(result.value.url);
  }

  async clipboardOperate(
    backend: string,
    path: string,
    clipboard: AppClipboard,
  ): Promise<Result<JobID<EmptyObj>, string>[]> {
    return Promise.all(
      clipboard.items.map((item) => {
        if (item.IsDir) {
          const dirName = item.Path.split('/').pop();
          return this.rcSyncAsync(
            clipboard.type,
            clipboard.backend,
            item.Path,
            backend,
            path + '/' + dirName,
            ExplorerService.actionSummary(clipboard.type, item.Path, backend),
          );
        } else {
          const fileName = item.Path.split('/').pop();
          return this.rcOperateAsync(
            clipboard.type,
            clipboard.backend,
            item.Path,
            backend,
            path + '/' + fileName,
            ExplorerService.actionSummary(clipboard.type, item.Path, backend),
          );
        }
      }),
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
    dstRemote: string,
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
    dstRemote: string,
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

  /**
   * @param action copy or move
   * @param srcFs fs name, without colon
   * @param srcRemote path of file, must be a file, not a directory.
   * @param dstFs fs name, without colon
   * @param dstRemote path of file, must be a file, not a directory.
   * @param summary summary text of this job
   * @returns observable may be error
   */
  private rcOperateAsync(
    action: 'copy' | 'move',
    srcFs: string,
    srcRemote: string,
    dstFs: string,
    dstRemote: string,
    summary?: string,
  ): Promise<Result<JobID<EmptyObj>, string>> {
    return this.jobService.callAsync<EmptyObj>(
      `operations/${action}file`,
      {
        srcFs: ExplorerService.toFs(srcFs),
        srcRemote,
        dstFs: ExplorerService.toFs(dstFs),
        dstRemote,
      },
      summary,
    );
  }

  /**
   * @param action one of [copy, move, sync, bisync]
   * @param srcFs fs name, without colon
   * @param srcRemote  path of file, must be a directory, not a file.
   * @param dstFs fs name, without colon
   * @param dstRemote path of file, must be a directory, not a file.
   * @param summary summary text of this job
   * @returns observable may be error
   */
  private rcSyncAsync(
    action: 'copy' | 'move' | 'sync' | 'bisync',
    srcFs: string,
    srcRemote: string,
    dstFs: string,
    dstRemote: string,
    summary?: string,
  ): Promise<Result<JobID<EmptyObj>, string>> {
    return this.jobService.callAsync<EmptyObj>(
      'sync/' + action,
      {
        srcFs: ExplorerService.toFs(srcFs) + srcRemote,
        dstFs: ExplorerService.toFs(dstFs) + dstRemote,
      },
      summary,
    );
  }

  private static toFs(backend: string) {
    if (backend === '') {
      return '/';
    } else {
      return backend + ':';
    }
  }

  private static actionSummary(
    action: 'move' | 'copy' | 'sync' | 'bisync',
    name: string,
    destination: string,
  ): string {
    let actionName: string;
    switch (action) {
      case 'move':
        actionName = $localize`move`;
        break;
      case 'copy':
        actionName = $localize`copy`;
        break;
      case 'sync':
        actionName = $localize`sync`;
        break;
      case 'bisync':
        actionName = $localize`bi-directional sync`;
        break;
    }
    return $localize`${actionName} "${name}" to "${destination}\:"`;
  }
}
