import { Component } from '@angular/core';

import { JobService } from './job.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
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
