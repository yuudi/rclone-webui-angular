import { Component, OnInit } from '@angular/core';
import { JobService } from './job.service';
import { JobInfo } from './job.model';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {
  jobs: { [key: number]: JobInfo } = {};
  constructor(private jobService: JobService) {}
  async ngOnInit() {
    const jobIdList = await this.jobService.getJobList();
    for (const jobId of jobIdList) {
      this.jobs[jobId] = (await this.jobService.getJobInfo(jobId)).orThrow();
    }
  }
}
