export interface ExplorerView {
  backend: string;
  path: string;
}

export interface AppClipboard {
  type: 'copy' | 'move';
  backend: string;
  items: DirectoryItem[];
}

export interface SyncClipboard {
  type: 'sync' | 'bisync';
  backend: string;
  dirPath: string;
}

export type DirectoryItem = FileItem | DirItem;

export interface FileItem extends DirectoryItemBase {
  readonly IsDir: false;
}

export interface DirItem extends DirectoryItemBase {
  readonly IsDir: true;
}

interface DirectoryItemBase {
  Path: string;
  Name: string;
  Size: number;
  MimeType: string;
  ModTime: Date;
}

export type EmptyObj = Record<string, never>;
