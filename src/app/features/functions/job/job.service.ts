import { Injectable } from '@angular/core';
import { distinctUntilChanged } from 'rxjs';

import { ConnectionService } from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { Ok, Result } from 'src/app/shared/result';
import { JobInfo } from './job.model';

export type JobID<R> = number;
type JobStatus = 'pending' | 'success' | 'failed';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private jobs: { id: JobID<unknown>; status?: JobStatus; summary?: string }[] =
    [];
  private finishedJobCache: { [key: number]: JobInfo<unknown> } = {};

  constructor(
    private connectionService: ConnectionService,
    private rc: RemoteControlService
  ) {
    // clear jobs when connection is changed
    connectionService
      .getActiveConnectionObservable()
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.jobs = [];
        this.fetchJobs();
      });
  }

  private async fetchJobs() {
    const jobids = await this.getJobList();
    for (const jobid of jobids) {
      (async (id) => {
        const jobInfo = (await this.getJobInfo(id)).orThrow();
        if (!jobInfo.finished) {
          // pending job
          this.jobs.push({
            id,
            status: 'pending',
            summary: JSON.stringify(jobInfo.input), // TODO: use summary
          });
        } else if (jobInfo.error) {
          // failed job
          this.jobs.push({
            id,
            status: 'failed',
            summary: JSON.stringify(jobInfo.input), // TODO: use summary
          });
        } else {
          // finished job, doing nothing
        }
      })(jobid);
    }
  }

  async callAsync<R>(
    operation: string,
    params?: {
      [key: string]: string | boolean | number | Record<string, unknown>;
    },
    summary?: string
  ): Promise<Result<JobID<R>, string>> {
    const result = await this.rc.call<{ jobid: number }>(operation, {
      _async: true,
      ...params,
    });
    if (!result.ok) {
      return result;
    }
    const jobid = result.value.jobid;
    this.jobs.push({
      id: jobid,
      status: 'pending',
      summary,
    });
    return Ok(jobid);
  }

  getJobs(): typeof this.jobs {
    return this.jobs;
  }

  private async getJobList() {
    const res = await this.rc.call<{ jobids: number[] }>('job/list');
    return res.orThrow().jobids;
  }

  async getJobInfo(jobid: number) {
    if (this.finishedJobCache[jobid]) {
      return Ok(this.finishedJobCache[jobid]);
    }
    const res = await this.rc.call<JobInfo>('job/status', { jobid });
    if (res.ok && res.value.finished) {
      this.finishedJobCache[jobid] = res.value;
    }
    return res;
  }

  killJob(jobid: number) {
    return this.rc.call('job/stop', { jobid });
  }

  removeJob(jobid: number) {
    const index = this.jobs.findIndex((job) => job.id === jobid);
    if (index >= 0) {
      this.jobs.splice(index, 1);
    }
  }
}
