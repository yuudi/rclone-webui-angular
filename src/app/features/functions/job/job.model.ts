interface BaseJobInfo {
  id: number;
  finished: boolean;
  success: boolean; // true for success false otherwise
  error: string; // empty string if no error
  duration: number; // in seconds
  startTime: Date;
  input: unknown; // wait for rclone to support this
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

export type JobInfo<R = unknown> =
  | PendingJobInfo
  | SuccessJobInfo<R>
  | ErrorJobInfo;
