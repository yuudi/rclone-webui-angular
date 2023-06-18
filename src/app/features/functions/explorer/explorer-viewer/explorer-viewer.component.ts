import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import {
  AppClipboard,
  DirItem,
  DirectoryItem,
  ExplorerView,
} from '../explorer.model';
import { ExplorerService } from '../explorer.service';

type Loading = undefined;
const Loading = undefined;

@Component({
  selector: 'app-explorer-viewer[backend][path]',
  templateUrl: './explorer-viewer.component.html',
  styleUrls: ['./explorer-viewer.component.scss'],
})
export class ExplorerViewerComponent implements OnInit, OnChanges {
  @Input() backend!: string;
  @Input() path!: string;
  @Output() pathChange = new EventEmitter<string>();
  @Output() clipboardAdded = new EventEmitter<AppClipboard>();
  @Output() clipboardPasted = new EventEmitter<ExplorerView>();
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  children: DirectoryItem[] | Loading = Loading;
  listChildrenSubScription?: Subscription;

  contextMenuItem?: DirectoryItem;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private snackBar: MatSnackBar,
    private rc: RemoteControlService,
    private explorerService: ExplorerService
  ) {}

  ngOnInit() {
    this.fetchChildren();
  }

  ngOnChanges() {
    this.fetchChildren();
  }

  fetchChildren() {
    this.children = Loading;

    this.listChildrenSubScription?.unsubscribe();
    this.listChildrenSubScription = this.explorerService
      .listChildren(this)
      .subscribe((children) => {
        this.children = children.list;
      });
  }

  itemDblClicked(item: DirectoryItem) {
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
    this.pathChange.emit(this.path);
  }

  itemRightClicked(item: DirectoryItem, event: MouseEvent) {
    event.preventDefault();
    this.contextMenuItem = item;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  downloadFileClicked() {
    if (!this.contextMenuItem) {
      throw new Error('No context menu item when download file clicked.');
    }
    return this.rc.downloadFile(this.backend, this.contextMenuItem.Path);
  }
}
