import { FsInfo } from '../backend/backend.model';

export interface ExplorerView {
  backend: string;
  path: string;
  info: Promise<FsInfo>;
  actions: {
    refresh?: () => void;
    getChildren?: () => DirectoryItem[] | undefined;
    addFolder?: (name: string) => void;
  };
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

export interface FileItem extends DirectoryItem {
  IsDir: false;
}

export interface DirItem extends DirectoryItem {
  IsDir: true;
}

export interface DirectoryItem {
  IsDir: boolean;
  Path: string;
  Name: string;
  Size: number;
  MimeType: string;
  ModTime: Date;
}

export type EmptyObj = Record<string, never>;
