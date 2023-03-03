import type { Timestamp } from 'firebase/firestore';

export enum ENoteVisibility {
  PUBLIC = 'PUBLIC',
  LIMITED = 'LIMITED',
  PRIVATE = 'PRIVATE'
}

export type PlainTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export type TNote = {
  id: string;
  owner: string;
  title: string;
  body: string;
  plainBody: string;
  category: string;
  visibility: ENoteVisibility;
  tags: string[];
  favoritedBy: string[];
  createdAt: Timestamp | PlainTimestamp;
  lastModified: Timestamp | PlainTimestamp;
};
