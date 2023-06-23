import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { first, lastValueFrom } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BackendService } from '../backend/backend.service';
import { RenameDialogComponent } from './explorer-viewer/rename-dialog/rename-dialog.component';
import { AppClipboard, ExplorerView } from './explorer.model';
import { ExplorerService } from './explorer.service';

type ViewsGroup = { tabs: ExplorerView[]; currentTab: number };

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  viewsGroups: ViewsGroup[] = [{ tabs: [], currentTab: 0 }]; // Initially, there is one group with no view.
  clipboard: AppClipboard | null = null;
  backendList: string[] | null = null;
  localFsList: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private explorerService: ExplorerService,
    private backendService: BackendService
  ) {
    iconRegistry.addSvgIcon(
      'tab_close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tab_close.svg')
    );
  }

  ngOnInit() {
    this.backendService.listBackends().then((list) => {
      this.backendList = list.orThrow();
    });

    this.fetchLocalFsList();

    this.route.queryParams.pipe(first()).subscribe((params) => {
      const backend = params['drive'];
      if (backend) {
        this.viewsGroups[0].tabs.push({
          backend: backend,
          path: '',
          info: this.backendService
            .getBackendInfo(backend)
            .then((result) => result.orThrow()),
          actions: {},
        });
      }
    });
  }

  async fetchLocalFsList() {
    const os = await this.explorerService.getOsType();
    if (os === 'windows') {
      // In Windows, there are no api to list all drives,
      // So we just try from C to Z,
      // When we get an error, we stop and assume that's the last drive.
      // This is not a good solution,
      // But it's the best we can do for now,
      // If new api is available, we should use that.
      let drive = 'C';
      while (drive <= 'Z') {
        const result = await this.backendService.checkWindowsDriveExist(drive);
        if (!result) {
          break;
        }
        this.localFsList.push(drive);
        drive = String.fromCharCode(drive.charCodeAt(0) + 1);
      }
    } else {
      this.localFsList.push('');
    }
  }

  splitAdd() {
    this.viewsGroups.push({ tabs: [], currentTab: -1 });
  }

  splitRemove(index: number) {
    this.viewsGroups.splice(index, 1);
  }

  tabAdd(group: ViewsGroup, backend: string) {
    group.tabs.push({
      backend: backend,
      path: '',
      info: this.backendService
        .getBackendInfo(backend)
        .then((result) => result.orThrow()),
      actions: {},
    });
    group.currentTab = group.tabs.length - 1;
  }

  tabRemove(group: ViewsGroup, tabIndex: number) {
    if (group.currentTab === tabIndex) {
      // If the tab to be removed is the current tab, select the previous tab.
      if (tabIndex > 0) {
        group.currentTab = tabIndex - 1;
      }
    } else if (group.currentTab > tabIndex) {
      // If the tab to be removed is before the current tab, decrement the current tab index.
      group.currentTab--;
    }

    group.tabs.splice(tabIndex, 1);
  }

  /**
   * Move a view to parent view in-place
   * this will trigger a refresh
   */
  goUp(view: ExplorerView) {
    const path = view.path.split('/');
    path.pop();
    view.path = path.join('/');
  }

  refresh(view: ExplorerView) {
    view.actions.refresh?.();
  }

  clipboardAdd(clipboard: AppClipboard) {
    this.clipboard = clipboard;
  }

  clipboardClear() {
    this.clipboard = null;
  }

  async clipboardPaste(view: ExplorerView, action?: 'copy' | 'move') {
    if (!this.clipboard) {
      console.error('clipboard is empty when paste');
      return;
    }
    const clipboard = this.clipboard;
    this.clipboard = null;
    if (action) {
      clipboard.type = action;
    }
    const resultList = await this.explorerService.clipboardOperate(
      view.backend,
      view.path,
      clipboard
    );
    if (resultList.length === 1) {
      const result = resultList[0];
      if (result.ok) {
        this.snackBar.open(
          $localize`Task Created Successfully`,
          $localize`Dismiss`
        );
      } else {
        this.snackBar.open(result.error, $localize`Dismiss`);
      }
      return;
    }
    const errors: string[] = [];
    for (const result of resultList) {
      if (!result.ok) {
        errors.push(result.error);
      }
    }
    if (errors.length === 0) {
      this.snackBar.open(
        $localize`Tasks Created Successfully`,
        $localize`Dismiss`
      );
    } else {
      this.snackBar.open(errors.join('\n'), $localize`Dismiss`);
    }
  }

  async createFolderClicked(view: ExplorerView) {
    const children = view.actions.getChildren?.();
    if (!children) {
      console.error($localize`view is not ready`);
      return;
    }
    const name = await lastValueFrom(
      this.dialog
        .open(RenameDialogComponent, {
          data: {
            title: $localize`Create Folder`,
            name: '',
            existNames: children.map((child) => child.Name),
          },
        })
        .afterClosed()
    );
    if (!name) {
      // User cancelled
      return;
    }
    const result = await this.explorerService.createEmptyFolder(
      view.backend,
      view.path + '/' + name
    );
    if (!result.ok) {
      this.snackBar.open(result.error, $localize`Dismiss`);
    }
    this.snackBar.open(
      $localize`Folder Created Successfully`,
      $localize`Dismiss`
    );
    view.actions.addFolder?.(name);
  }
}
