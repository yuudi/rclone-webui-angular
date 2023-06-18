export interface AppProvider {
  Name: string;
  Description: string;
  Prefix: string;
  Options: Option[];
  CommandHelp: CommandHelp[] | null;
}

export interface CommandHelp {
  Name: string;
  Short: string;
  Long: string;
  Opts: Opts | null;
}

export interface Opts {
  chunk_size?: string;
  service_account_file?: string;
  target?: string;
  echo?: string;
  error?: string;
  description?: string;
  lifetime?: string;
  priority?: string;
  'max-age'?: string;
}

type HttpHeaders = Record<string, string>;

export interface Option {
  Name: string;
  Help: string;
  Provider: string;
  Default: HttpHeaders | boolean | number | string;
  Value: null;
  ShortOpt: string;
  Hide: 0 | 2 | 3;
  Required: boolean;
  IsPassword: boolean;
  NoPrefix: boolean;
  Advanced: boolean;
  DefaultStr: string;
  ValueStr: string;
  Type:
    | 'bool'
    | 'CommaSepList'
    | 'Duration'
    | 'int'
    | 'MultiEncoder'
    | 'SizeSuffix'
    | 'string';
  Examples?: Example[];
}

export interface Example {
  Value: string;
  Help: string;
  Provider: string;
}
