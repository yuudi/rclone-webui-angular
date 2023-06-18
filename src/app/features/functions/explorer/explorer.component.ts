import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { first, lastValueFrom } from 'rxjs';

import { MatIconRegistry } from '@angular/material/icon';

import { BackendService } from '../backend/backend.service';
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
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private explorerService: ExplorerService,
    private backendService: BackendService
  ) {
    iconRegistry.addSvgIcon(
      'tab_close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tab_close.svg')
    );
  }

  ngOnInit() {
    this.backendService.listBackends().subscribe((list) => {
      this.backendList = list.remotes;
    });

    this.fetchLocalFsList();

    this.route.queryParams.pipe(first()).subscribe((params) => {
      const backend = params['drive'];
      if (backend) {
        this.viewsGroups[0].tabs.push({
          backend: backend,
          path: '',
        });
      }
    });
  }

  async fetchLocalFsList() {
    const os = await lastValueFrom(this.explorerService.getOsType());
    if (os === 'windows') {
      // In Windows, there are no api to list all drives,
      // So we just try from C to Z,
      // This is not a good solution,
      // But it's the best we can do for now,
      // If new api is available, we should use that.
      let drive = 'C';
      while (drive <= 'Z') {
        try {
          await lastValueFrom(this.backendService.getBackendUsage(drive));
          this.localFsList.push(drive);
          drive = String.fromCharCode(drive.charCodeAt(0) + 1);
        } catch (error) {
          return;
        }
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
