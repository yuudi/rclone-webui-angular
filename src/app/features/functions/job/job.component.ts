import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { JobService } from './job.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
})
export class JobComponent {
  jobs$ = this.jobService.getJobs();
  constructor(
    private jobService: JobService,
    private snackBar: MatSnackBar,
  ) {}

  async removeJob(jobId: number) {
    try {
      await this.jobService.removeJob(jobId);
    } catch (err) {
      this.snackBar.open(
        $localize`Failed to remove job: ` + (err as Error).message,
        $localize`Dismiss`,
      );
    }
  }

  async killJob(jobId: number) {
    try {
      await this.jobService.killJob(jobId);
      this.snackBar.open($localize`Job stop command sent`, $localize`Dismiss`);
    } catch (err) {
      this.snackBar.open(
        $localize`Failed to stop job: ` + (err as Error).message,
        $localize`Dismiss`,
      );
    }
  }

  async removeFinishedJobs() {
    try {
      await this.jobService.removeFinishedJobs();
    } catch (err) {
      this.snackBar.open(
        $localize`Failed to clear finished jobs: ` + (err as Error).message,
        $localize`Dismiss`,
      );
    }
  }
}
