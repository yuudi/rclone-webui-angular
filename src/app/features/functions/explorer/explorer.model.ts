export interface ExplorerView {
  backend: string;
  path: string;
}

export interface AppClipboard {
  type: 'copy' | 'move';
  backend: string;
  items: ExplorerItem[];
}

export interface SyncClipboard {
  type: 'sync' | 'bisync';
  backend: string;
  dirPath: string;
}

export interface FileItem {
  Path: string;
  readonly IsDir: false;
}

export const FileItem = (Path: string) => ({ Path, IsDir: false } as FileItem);

export interface DirItem {
  Path: string;
  readonly IsDir: true;
}

export const DirItem = (Path: string) => ({ Path, IsDir: true } as DirItem);

export type ExplorerItem = FileItem | DirItem;

export interface DirectoryItem {
  Path: string;
  Name: string;
  Size: number;
  MimeType: string;
  ModTime: Date;
  IsDir: boolean;
}

export type EmptyObj = Record<string, never>;
