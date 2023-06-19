/**
 * see https://rclone.org/rc/#core-stats
 */
export interface TransferStatus {
  bytes: number;
  checks: number;
  deletes: number;
  elapsedTime: number;
  errors: number;
  eta: number;
  fatalError: boolean;
  lastError: string;
  renames: number;
  retryError: boolean;
  speed: number;
  totalBytes: number;
  totalChecks: number;
  totalTransfers: number;
  transferTime: number;
  transfers: number;
  transferring?: {
    bytes: number;
    eta: number;
    name: string;
    percentage: number;
    speed: number;
    speedAvg: number;
    size: number;
  }[];
  checking: string[];
}

/**
 * see https://rclone.org/rc/#core-version
 */
export interface RcloneVersionInfo {
  version: string;
  decomposed: [number, number, number];
  isGit: boolean;
  isBeta: boolean;
  os: string;
  arch: string;
  goVersion: string;
  linking: string;
  goTags: string | 'none';
}
