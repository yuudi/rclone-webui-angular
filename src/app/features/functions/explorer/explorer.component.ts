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

  tabRemove(group: ViewsGroup) {
    const index = group.currentTab;
    group.tabs.splice(index, 1);
    // new index number will be automatically set by Material UI
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
