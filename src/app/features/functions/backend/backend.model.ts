export interface Backend {
  type: string;
  [key: string]: string;
}

export interface BackendUsage {
  total?: number; // if not set, it's unlimited
  used?: number;
  trashed?: number;
  other?: number;
  free?: number;
  objects?: number; // count of objects
}
