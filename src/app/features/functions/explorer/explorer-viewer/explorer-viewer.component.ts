import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { environment } from 'src/environments/environment';
import { FsInfo } from '../../backend/backend.model';
import {
  AppClipboard,
  DirItem,
  DirectoryItem,
  ExplorerView,
  FileItem,
} from '../explorer.model';
import { ExplorerService } from '../explorer.service';
import { CopyDialogComponent } from './copy-dialog/copy-dialog.component';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';

const Loading = undefined;
type Loading = undefined;

@Component({
  selector: 'app-explorer-viewer[backend][path]',
  templateUrl: './explorer-viewer.component.html',
  styleUrls: ['./explorer-viewer.component.scss'],
})
export class ExplorerViewerComponent implements OnInit, OnChanges {
  @Input() backend!: string;
  @Input() path!: string;
  @Input() info: FsInfo | null = null;
  @Output() pathChange = new EventEmitter<string>();
  @Output() clipboardAdded = new EventEmitter<AppClipboard>();
  @Input() actions!: ExplorerView['actions'];
  @ViewChild('selectionList') selectionList!: MatSelectionList;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  children: DirectoryItem[] | Loading = Loading;

  multiSelectMode = false;
  contextMenuItem?: DirectoryItem;
  contextMenuPosition = { x: '0px', y: '0px' };

  canDownload = environment.explorerCanDownload;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private rc: RemoteControlService,
    private explorerService: ExplorerService,
  ) {}

  ngOnInit(): void {
    this.actions.refresh = () => void this.fetchChildren();
    this.actions.getPath = () => this.path;
    this.actions.getChildren = () => this.children;
    this.actions.addChild = (name, isFolder) => {
      this.children?.push({
        Name: name,
        Path: this.path + '/' + name,
        IsDir: isFolder,
        Size: -1,
        MimeType: 'inode/directory',
        ModTime: new Date(),
      });
    };

    this.fetchChildren();
  }

  ngOnChanges() {
    this.fetchChildren();
  }

  async fetchChildren() {
    this.children = Loading;
    this.multiSelectMode = false;
    const taskPath = this.path;

    const result = await this.explorerService.listChildren(
      this.backend,
      this.path,
    );
    if (!result.ok) {
      this.snackBar.open(result.error, $localize`OK`);
      this.children = [];
      throw new Error(result.error);
    }
    if (taskPath !== this.path) {
      // path changed
      return;
    }
    this.children = result.value;
  }

  selectionChanged() {
    const selected = this.selectionList.selectedOptions.selected;

    if (selected.length === 0) {
      this.multiSelectMode = false;
    }
  }

  itemOpened(item: FileItem | DirItem) {
    if (item.IsDir) {
      this.openFolder(item);
    } else {
      this.snackBar.open(
        $localize`Opening File is not implemented yet.`,
        $localize`OK`,
      );
    }
  }

  openFolder(item: DirItem) {
    this.path = item.Path;
    this.pathChange.emit(this.path);
  }

  itemRightClicked(item: DirectoryItem, event: MouseEvent) {
    event.preventDefault();
    this.contextMenuItem = item;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  multiSelectClicked() {
    const item = this.contextMenuItem;
    if (!item) {
      throw new Error('No context menu item when copy clicked.');
    }
    this.multiSelectMode = true;
  }

  private getSelectedItems(): DirectoryItem[] {
    if (this.multiSelectMode) {
      return this.selectionList.selectedOptions.selected.map((i) => i.value);
    } else {
      const item = this.contextMenuItem;
      if (!item) {
        return [];
      }
      return [item];
    }
  }

  copyClicked() {
    const items = this.getSelectedItems();
    if (items.length === 0) {
      throw new Error('No context menu item when copy clicked.');
    }
    this.clipboardAdded.emit({
      type: 'copy',
      backend: this.backend,
      items,
    });
    this.snackBar.open(
      $localize`Item Added to Clipboard, now go to destination and paste`,
      $localize`OK`,
    );
  }

  moveClicked() {
    const items = this.getSelectedItems();
    if (items.length === 0) {
      throw new Error('No context menu item when move clicked.');
    }
    this.clipboardAdded.emit({
      type: 'move',
      backend: this.backend,
      items,
    });
    this.snackBar.open(
      $localize`Item Added to Clipboard, now go to destination and paste`,
      $localize`OK`,
    );
  }

  async renameClicked() {
    const item = this.contextMenuItem;
    if (!item) {
      throw new Error('No context menu item when delete clicked.');
    }
    const dialog = this.dialog.open(RenameDialogComponent, {
      data: {
        title: $localize`Rename`,
        name: item.Name,
        existNames: this.children?.map((i) => i.Name) ?? [],
      },
    });
    const name = await lastValueFrom(dialog.afterClosed());
    if (!name) {
      // canceled
      return;
    }
    this.renameConfirmed(item, name);
  }

  async renameConfirmed(item: DirectoryItem, newName: string) {
    const result = await this.explorerService.renameItem(
      this.backend,
      item,
      newName,
    );
    if (!result.ok) {
      this.snackBar.open(result.error, $localize`OK`);
      return;
    }
    this.snackBar.open($localize`Renamed`);
    item.Name = newName;
  }

  async deleteClicked() {
    const items = this.getSelectedItems();
    if (items.length === 0) {
      throw new Error('No context menu item when delete clicked.');
    }
    const result: boolean | void = await lastValueFrom(
      this.dialog
        .open(DeleteConfirmDialogComponent, {
          data: items,
        })
        .afterClosed(),
    );
    if (result === true) {
      this.deleteConfirmed(items);
    }
  }

  async deleteConfirmed(items: DirectoryItem[]) {
    await Promise.all(items.map((i) => this.deleteItem(i)));
    this.snackBar.open($localize`Deleted`);
  }

  private async deleteItem(item: DirectoryItem) {
    const result = await this.explorerService.deleteItem(this.backend, item);
    if (!result.ok) {
      this.snackBar.open(result.error, $localize`OK`);
      throw new Error(result.error);
    }
    const index = this.children?.findIndex((i) => i.Path === item.Path);
    if (index === undefined || index === -1) {
      throw new Error('Deleted item not found in children.');
    }
    this.children?.splice(index, 1);
  }

  async generateLinkClicked() {
    const item = this.contextMenuItem;
    if (!item) {
      throw new Error('No context menu item when generate link clicked.');
    }
    const result = await this.explorerService.generateLink(
      this.backend,
      item.Path,
    );
    if (!result.ok) {
      this.snackBar.open(result.error, $localize`OK`);
      return;
    }
    this.dialog.open(CopyDialogComponent, {
      data: {
        content: result.value,
      },
    });
  }

  downloadClicked() {
    if (!this.contextMenuItem) {
      throw new Error('No context menu item when download file clicked.');
    }
    return this.rc.downloadFile(this.backend, this.contextMenuItem.Path);
  }
}
