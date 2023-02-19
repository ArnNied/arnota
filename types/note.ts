export enum EVisibility {
  PUBLIC = 'PUBLIC',
  UNLISTED = 'UNLISTED',
  PRIVATE = 'PRIVATE'
}

export type TNote = {
  owner: string;
  title: string;
  body: string;
  plainBody: string;
  category: string;
  visibility: EVisibility;
  tags: string[];
  favoritedBy: string[];
  createdAt: number;
  lastModified: number;
};

export type TNoteWithId = TNote & {
  id: string;
};

export type TNoteWithIdAndUsername = TNoteWithId & {
  ownerUsername: string;
};
