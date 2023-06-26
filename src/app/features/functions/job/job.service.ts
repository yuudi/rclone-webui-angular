import { Injectable } from '@angular/core';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { JobInfo } from './job.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private rc: RemoteControlService) {}

  async getJobList() {
    const res = await this.rc.call<{ jobids: number[] }>('job/list');
    return res.orThrow().jobids;
  }

  getJobInfo(jobid: number) {
    return this.rc.call<JobInfo>('job/status', { jobid });
  }

  killJob(jobid: number) {
    return this.rc.call('job/stop', { jobid });
  }
}
