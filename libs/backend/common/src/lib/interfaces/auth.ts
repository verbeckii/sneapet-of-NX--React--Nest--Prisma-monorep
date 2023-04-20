interface Obj extends Object {
  [p: string]: any;
}
/* eslint-disable @typescript-eslint/no-namespace */
export class AuthUser {
  id: number;
  Code: string;
  Nome?: string;
  AuthCode?: string;
  isAdmin: boolean;
  isStoreAdmin: boolean;
  StartHour: number;
  EndHour: number;
  Show?: string;
  Visitors?: string;
  isMall: boolean;
  showGroup: boolean;
  GroupDelta: number;
  showAttendance: boolean;
  Customer_id: number;
  ApiKey: string;
  Stores: number[];
  StoreGroups: number[];
  HiddenIndexes: string[];
  AlwaysShowIndexes: string[];
  Params: Obj;
  showInOut: string;
  showFloors: boolean;
  MapRegion: string;
  ShowMap: boolean;
}

declare global {
  namespace Express {
    // from passport: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/42055#issuecomment-700553745
    class User extends AuthUser {}
  }
}

export interface Token {
  token: string;
  expiry: number;
  user: AuthUser;
}

export interface Tokens {
  [key: string]: Token;
}
