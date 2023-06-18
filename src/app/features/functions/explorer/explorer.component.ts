import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';

import { AppClipboard, ExplorerView } from './explorer.model';
import { ExplorerService } from './explorer.service';

type ViewsGroup = { tabs: ExplorerView[]; currentTab: number };

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  readonly LOCAL_FS_DISPLAY = $localize`Local File System`;

  viewsGroups: ViewsGroup[] = [{ tabs: [], currentTab: -1 }]; // Initially, there is one group with no view.
  clipboard: AppClipboard | null = null;
  backendList: string[] | null = null;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private explorerService: ExplorerService
  ) {
    iconRegistry.addSvgIcon(
      'tab_close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tab_close.svg')
    );
  }

  ngOnInit() {
    this.explorerService.listBackends().subscribe((list) => {
      this.backendList = list.remotes;
    });
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
   */
  goUp(view: ExplorerView) {
    const path = view.path.split('/');
    path.pop();
    view.path = path.join('/');
  }
}
