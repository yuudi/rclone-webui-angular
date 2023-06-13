export interface Backend {
  type: string;
  [key: string]: string;
}

export interface BackendUsage {
  total: number;
  used: number;
  trashed?: number;
  other?: number;
  free: number;
}
