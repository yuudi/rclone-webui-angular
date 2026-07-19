import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { JobService } from './job.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  imports: [
    CommonModule,
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
  constructor(private jobService: JobService) {}

  removeJob(jobId: number) {
    this.jobService.removeJob(jobId);
  }

  killJob(jobId: number) {
    this.jobService.killJob(jobId);
  }

  removeFinishedJobs() {
    this.jobService.removeFinishedJobs();
  }
}
