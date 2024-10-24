import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

import {
  Connection,
  ConnectionService,
} from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import {
  AppStorageService,
  ObservableAwaitableStorageItem,
} from 'src/app/cores/storage';
import { Err, Ok, Result } from 'src/app/shared/result';
import { environment } from 'src/environments/environment';
import { JobInfo } from './job.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type JobID<R = unknown> = number;
type JobStatus = 'pending' | 'success' | 'failed';
type JobOverview = { id: JobID<unknown>; status: JobStatus; summary: string };

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private jobsStorage?: ObservableAwaitableStorageItem<{
    executeId: string;
    jobs: JobOverview[];
  }>;
  private jobsSubject = new BehaviorSubject<JobOverview[]>([]);
  private finishedJobCache: { [key: number]: JobInfo } = {};

  constructor(
    private storageService: AppStorageService,
    private rc: RemoteControlService,
    connectionService: ConnectionService,
  ) {
    // clear jobs when connection is changed
    connectionService
      .getActiveConnectionObservable()
      .subscribe((connection) => {
        if (!connection) {
          return;
        }
        this.connectionChanged(connection);
      });
  }

  private connectionChanged(connection: Connection) {
    this.jobsStorage?.destructor();
    this.jobsStorage = this.storageService.getObservableItem(
      `${connection.id}-jobs`,
      () => ({ executeId: '', jobs: [] }),
    );
    this.jobsStorage
      .asObservable()
      .pipe(map((jobs) => jobs.jobs))
      .subscribe(this.jobsSubject.next.bind(this.jobsSubject));
    this.updateJobs();
  }

  async updateJobs() {
    if (!this.jobsStorage) {
      throw new Error('jobsStorage is initialized');
    }
    const [storageJobs, remoteJobs] = await Promise.all([
      this.jobsStorage.get(),
      this.getJobList(),
    ]);
    let reused;
    if (remoteJobs.executeId === undefined) {
      // old version, missing executeId
      reused = environment.reuseMissingExecuteId;
      remoteJobs.executeId = '';
    } else {
      reused = remoteJobs.executeId === storageJobs.executeId;
    }
    let jobsNeedUpdate: Iterable<JobID>;
    if (reused) {
      const storagePendingJobIds = storageJobs.jobs
        .filter((job) => job.status === 'pending')
        .map((job) => job.id);
      // union of storageJobIds and remoteJobIds
      jobsNeedUpdate = new Set([...storagePendingJobIds, ...remoteJobs.jobids]);
    } else {
      jobsNeedUpdate = remoteJobs.jobids;
      this.jobsStorage.set({
        executeId: remoteJobs.executeId,
        jobs: [],
      });
    }
    for (const jobid of jobsNeedUpdate) {
      this.updateJob(jobid);
    }
  }

  private async updateJob(id: JobID) {
    if (this.jobsStorage === undefined) {
      throw new Error('jobsStorage is initialized');
    }
    const [jobs, jobInfoResult] = await Promise.all([
      this.jobsStorage.get(),
      this.getJobInfo(id),
    ]);
    const jobInfo = jobInfoResult.orThrow();
    const index = jobs.jobs.findIndex((job) => job.id === id);
    if (index === -1) {
      // new job
      this.appendJob(jobInfo, 'unknown job created on other client');
    } else {
      // existing job
      if (!jobInfo.finished) {
        // pending, doing nothing
        return;
      }
      // fetch again to avoid conflict
      const jobs = await this.jobsStorage.get();
      if (jobInfo.error) {
        // failed job
        jobs.jobs[index].status = 'failed';
        jobs.jobs[index].summary = jobInfo.error;
      } else {
        // success job
        jobs.jobs[index].status = 'success';
      }
      this.jobsStorage.set(jobs);
    }
  }

  private async appendJob(
    jobInfo: {
      id: JobID;
      finished: boolean;
      error?: string;
    },
    summary: string,
  ) {
    if (this.jobsStorage === undefined) {
      throw new Error('jobsStorage is initialized');
    }
    const jobs = await this.jobsStorage.get();
    if (!jobInfo.finished) {
      // unfinished job
      jobs.jobs.push({
        id: jobInfo.id,
        status: 'pending',
        summary,
      });
    } else if (jobInfo.error) {
      // failed job
      jobs.jobs.push({
        id: jobInfo.id,
        status: 'failed',
        summary,
      });
    } else {
      // finished job, doing nothing
      return;
    }
    this.jobsStorage.set(jobs);
  }

  async callAsync<R>(
    operation: string,
    params?: {
      [key: string]: string | boolean | number | Record<string, unknown>;
    },
    summary?: string,
  ): Promise<Result<JobID<R>, string>> {
    const result = await this.rc.call<{ jobid: number }>(operation, {
      _async: true,
      ...params,
    });
    if (!result.ok) {
      return result;
    }
    const jobid = result.value.jobid;
    this.appendJob(
      {
        id: jobid,
        finished: false,
      },
      summary ?? operation,
    );
    return Ok(jobid);
  }

  getJobs(): Observable<JobOverview[]> {
    return this.jobsSubject;
  }

  private async getJobList() {
    const res = await this.rc.call<{ executeId?: string; jobids: number[] }>(
      'job/list',
    );
    return res.orThrow();
  }

  async getJobInfo<R>(jobid: JobID<R>): Promise<Result<JobInfo<R>, string>> {
    if (this.finishedJobCache[jobid]) {
      return Ok(this.finishedJobCache[jobid]);
    }
    const res = await this.rc.call<JobInfo<R>>('job/status', { jobid });
    if (res.ok && res.value.finished) {
      this.finishedJobCache[jobid] = res.value;
    }
    return res;
  }

  killJob(jobid: JobID) {
    return this.rc.call('job/stop', { jobid });
  }

  async removeJob(jobid: JobID) {
    if (this.jobsStorage === undefined) {
      throw new Error('jobsStorage is initialized');
    }

    const job = await this.jobsStorage.get();
    const index = job.jobs.findIndex((job) => job.id === jobid);
    if (index === -1) {
      return Err('job not found');
    }
    job.jobs.splice(index, 1);
    this.jobsStorage.set(job);
    return Ok();
  }

  async removeFinishedJobs() {
    if (this.jobsStorage === undefined) {
      throw new Error('jobsStorage is initialized');
    }
    const jobs = await this.jobsStorage.get();
    jobs.jobs = jobs.jobs.filter((job) => job.status !== 'success');
    this.jobsStorage.set(jobs);
  }
}
