import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import {
  AppClipboard,
  DirItem,
  DirectoryItem,
  ExplorerView,
  FileItem,
} from '../explorer.model';
import { ExplorerService } from '../explorer.service';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';

type Loading = undefined;
const Loading = undefined;

@Component({
  selector: 'app-explorer-viewer[backend][path]',
  templateUrl: './explorer-viewer.component.html',
  styleUrls: ['./explorer-viewer.component.scss'],
})
export class ExplorerViewerComponent {
  @Input() backend!: string;
  @Output() pathChange = new EventEmitter<string>();
  @Output() clipboardAdded = new EventEmitter<AppClipboard>();
  @Output() clipboardPasted = new EventEmitter<ExplorerView>();
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  private _path!: string;
  get path() {
    return this._path;
  }
  @Input() set path(path: string) {
    if (this._path === path) {
      return;
    }
    this._path = path;
    this.pathChange.emit(path);

    this.currentPathSubScription.unsubscribe();
    this.currentPathSubScription = new Subscription();
    this.fetchChildren();
  }

  children: DirectoryItem[] | Loading = Loading;
  currentPathSubScription = new Subscription();

  contextMenuItem?: DirectoryItem;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private rc: RemoteControlService,
    private explorerService: ExplorerService
  ) {}

  fetchChildren() {
    this.children = Loading;

    const sub = this.explorerService
      .listChildren(this)
      .subscribe((children) => {
        this.children = children.list;
      });
    this.currentPathSubScription.add(sub);
  }

  itemDblClicked(item: FileItem | DirItem) {
    if (item.IsDir) {
      this.openFolder(item);
    } else {
      this.snackBar.open(
        $localize`Opening File is not implemented yet.`,
        $localize`OK`
      );
    }
  }

  openFolder(item: DirItem) {
    this.path = item.Path;
  }

  itemRightClicked(item: DirectoryItem, event: MouseEvent) {
    event.preventDefault();
    this.contextMenuItem = item;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  deleteClicked() {
    const item = this.contextMenuItem;
    if (!item) {
      throw new Error('No context menu item when delete clicked.');
    }
    const dialog = this.dialog.open(DeleteConfirmDialogComponent, {
      data: item,
    });
    const sub = dialog.componentInstance.confirm.subscribe(() =>
      this.deleteConfirmed(item)
    );
    this.currentPathSubScription.add(sub);
  }

  deleteConfirmed(item: DirectoryItem) {
    const sub = this.explorerService
      .deleteItem(this.backend, item)
      .subscribe(() => {
        this.snackBar.open('Deleted');
        const index = this.children?.findIndex((i) => i.Path === item.Path);
        if (index === undefined || index === -1) {
          throw new Error('Deleted item not found in children.');
        }
        this.children?.splice(index, 1);
      });
    this.currentPathSubScription.add(sub);
  }

  downloadClicked() {
    if (!this.contextMenuItem) {
      throw new Error('No context menu item when download file clicked.');
    }
    return this.rc.downloadFile(this.backend, this.contextMenuItem.Path);
  }
}
