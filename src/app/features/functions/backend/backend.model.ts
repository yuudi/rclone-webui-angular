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

export interface FsInfo {
  Features: { [key in FeatureType]: boolean }; // Thank you backend developers for this mess.
  Hashes: HashType[];
  Name: string;
}

type FeatureType =
  | 'About'
  | 'BucketBased'
  | 'BucketBasedRootOK'
  | 'CanHaveEmptyDirectories'
  | 'CaseInsensitive'
  | 'ChangeNotify'
  | 'CleanUp'
  | 'Command'
  | 'Copy'
  | 'DirCacheFlush'
  | 'DirMove'
  | 'Disconnect'
  | 'DuplicateFiles'
  | 'GetTier'
  | 'IsLocal'
  | 'ListR'
  | 'MergeDirs'
  | 'MetadataInfo'
  | 'Move'
  | 'OpenWriterAt'
  | 'PublicLink'
  | 'Purge'
  | 'PutStream'
  | 'PutUnchecked'
  | 'ReadMetadata'
  | 'ReadMimeType'
  | 'ServerSideAcrossConfigs'
  | 'SetTier'
  | 'SetWrapper'
  | 'Shutdown'
  | 'SlowHash'
  | 'SlowModTime'
  | 'UnWrap'
  | 'UserInfo'
  | 'UserMetadata'
  | 'WrapFs'
  | 'WriteMetadata'
  | 'WriteMimeType';

type HashType =
  | 'md5'
  | 'sha1'
  | 'whirlpool'
  | 'crc32'
  | 'sha256'
  | 'dropbox'
  | 'hidrive'
  | 'mailru'
  | 'quickxor';
