interface BaseJobInfo {
  id: number;
  finished: boolean;
  success: boolean; // true for success false otherwise
  error: string; // empty string if no error
  duration: number; // in seconds
  startTime: Date;
}

interface PendingJobInfo extends BaseJobInfo {
  finished: false;
  success: false;
  error: '';
  progress: unknown;
}

interface SuccessJobInfo<R> extends BaseJobInfo {
  finished: true;
  success: true;
  error: '';
  output: R;
  endTime: Date;
}

interface ErrorJobInfo extends BaseJobInfo {
  finished: true;
  success: false;
  error: string;
  duration: number;
  endTime: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JobInfo<R = any> =
  | PendingJobInfo
  | SuccessJobInfo<R>
  | ErrorJobInfo;
