import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import packageJson from '../../../../package.json';
import { environment } from '../../../environments/environment';

import { RcloneVersionInfo, TransferStatus } from './dashboard.model';
import { DashboardService } from './dashboard.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
})
export class DashboardComponent implements OnInit {
  backends?: string[] | null;
  goToPath = '';
  version?: RcloneVersionInfo;
  webUIVersion = packageJson.version;
  webUIEnv = environment.environment;
  stat$?: Observable<TransferStatus>;
  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar,
  ) {}
  async ngOnInit() {
    try {
      this.backends = (await this.dashboardService.getBackends()).remotes;
      this.version = await this.dashboardService.getVersion();
      this.stat$ = this.dashboardService.getStat();
    } catch (err) {
      this.snackBar.open(
        $localize`Failed to load dashboard data: ` + (err as Error).message,
        $localize`Dismiss`,
      );
    }
  }
}
