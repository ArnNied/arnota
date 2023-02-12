export enum EVisibility {
  PUBLIC = 'PUBLIC',
  UNLISTED = 'UNLISTED',
  PRIVATE = 'PRIVATE'
}

export type TNote = {
  owner: string;
  title: string;
  body: string;
  category: null | string;
  visibility: EVisibility;
  tags?: string[];
  createdAt: number;
  lastModified: number;
};

export type TNoteWithId = TNote & {
  id: string;
};

export type TNoteWithIdAndUsername = TNoteWithId & {
  ownerUsername: string;
};
