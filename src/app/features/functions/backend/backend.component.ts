import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Backend, BackendUsage } from './backend.model';
import { BackendService } from './backend.service';
import { tap } from 'rxjs';

type Unmeasured = null;
const Unmeasured = null;

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss'],
})
export class BackendComponent implements OnInit {
  backendList?: {
    id: string;
    config: Backend;
    usage?: BackendUsage | Unmeasured;
  }[];

  constructor(
    private snackBar: MatSnackBar,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.backendService
      .getBackends()
      .pipe(
        tap({
          error: this.displayError.bind(this),
        })
      )
      .subscribe((backends) => {
        this.backendList = [];
        for (const id in backends) {
          this.backendList.push({
            id,
            config: backends[id],
          });
          this.fetchUsage(id);
        }
      });
  }

  fetchUsage(id: string) {
    const ref = this.backendList?.find((backend) => backend.id === id);
    if (!ref) {
      console.error(`Backend ${id} not found!`);
      return;
    }
    this.backendService.getBackendUsage(id).subscribe({
      next: (usage) => {
        ref.usage = usage;
      },
      error: () => {
        ref.usage = Unmeasured;
      },
    });
  }

  private displayError(error: unknown) {
    this.snackBar.open(`error: ${error}`, 'Dismiss');
  }
}
