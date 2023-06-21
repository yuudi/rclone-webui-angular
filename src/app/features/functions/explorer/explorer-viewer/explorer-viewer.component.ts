import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import {
  AppClipboard,
  DirItem,
  DirectoryItem,
  FileItem,
} from '../explorer.model';
import { ExplorerService } from '../explorer.service';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';
import { CopyDialogComponent } from './copy-dialog/copy-dialog.component';

type Loading = undefined;
const Loading = undefined;

@Component({
  selector: 'app-explorer-viewer[backend][path]',
  templateUrl: './explorer-viewer.component.html',
  styleUrls: ['./explorer-viewer.component.scss'],
})
export class ExplorerViewerComponent implements OnInit {
  @Input() backend!: string;
  @Output() pathChange = new EventEmitter<string>();
  @Output() clipboardAdded = new EventEmitter<AppClipboard>();
  @Input() refresh$?: Observable<void>;
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

  ngOnInit(): void {
    this.refresh$?.subscribe(() => {
      this.fetchChildren();
    });
  }

  fetchChildren() {
    this.children = Loading;

    const sub = this.explorerService
      .listChildren(this.backend, this.path)
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

  copyClicked() {
    const item = this.contextMenuItem;
    if (!item) {
      throw new Error('No context menu item when copy clicked.');
    }
    this.clipboardAdded.emit({
      type: 'copy',
      backend: this.backend,
      items: [item],
    });
  }

  moveClicked() {
    const item = this.contextMenuItem;
    if (!item) {
      throw new Error('No context menu item when move clicked.');
    }
    this.clipboardAdded.emit({
      type: 'move',
      backend: this.backend,
      items: [item],
    });
  }

  renameClicked() {
    const item = this.contextMenuItem;
    if (!item) {
      throw new Error('No context menu item when delete clicked.');
    }
    const nameAvailable$ = new Subject<boolean>();
    const dialog = this.dialog.open(RenameDialogComponent, {
      data: {
        name: item.Name,
        nameAvailable$,
      },
    });
    const nameSub = dialog.componentInstance.nameChange.subscribe((name) => {
      if (!name) {
        nameAvailable$.next(false);
        return;
      }
      const exist = this.children?.find((i) => i.Name === name);
      nameAvailable$.next(!exist);
    });
    this.currentPathSubScription.add(nameSub);
    const confirmSub = dialog.componentInstance.confirm.subscribe((name) => {
      this.renameConfirmed(item, name);
    });
    this.currentPathSubScription.add(confirmSub);
  }

  renameConfirmed(item: DirectoryItem, newName: string) {
    const sub = this.explorerService
      .renameItem(this.backend, item, newName)
      .subscribe(() => {
        this.snackBar.open($localize`Renamed`);
        item.Name = newName;
      });
    this.currentPathSubScription.add(sub);
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
        this.snackBar.open($localize`Deleted`);
        const index = this.children?.findIndex((i) => i.Path === item.Path);
        if (index === undefined || index === -1) {
          throw new Error('Deleted item not found in children.');
        }
        this.children?.splice(index, 1);
      });
    this.currentPathSubScription.add(sub);
  }

  generateLinkClicked() {
    const item = this.contextMenuItem;
    if (!item) {
      throw new Error('No context menu item when generate link clicked.');
    }
    const sub = this.explorerService
      .generateLink(this.backend, item.Path)
      .subscribe({
        next: (link) => {
          this.dialog.open(CopyDialogComponent, {
            data: {
              content: link,
            },
          });
        },
        error: (error) => {
          this.snackBar.open($localize`Error:` + String(error), $localize`OK`);
        },
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
