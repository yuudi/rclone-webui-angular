import { Component, OnInit } from '@angular/core';
import { JobService } from './job.service';
import { JobInfo } from './job.model';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {
  jobInfos: { [key: number]: Promise<JobInfo> } = {};
  jobs = this.jobService.getJobs();
  constructor(private jobService: JobService) {}

  ngOnInit() {
    const jobList = this.jobService.getJobs();
    for (const job of jobList) {
      this.jobInfos[job.id] = this.jobService
        .getJobInfo(job.id)
        .then((result) => result.orThrow());
    }
  }

  removeJob(jobId: number) {
    this.jobService.removeJob(jobId);
    delete this.jobInfos[jobId];
  }

  // removeFinishedJob() {
  //   for (const [jobId, jobInfo] of Object.entries(this.jobs)) {
  //     // if promise is pending, skip
  //
  //   }
  // }
}
