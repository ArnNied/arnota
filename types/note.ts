export enum EVisibility {
  PUBLIC,
  UNLISTED,
  PRIVATE
}

export type TNote = {
  // owner: string,
  id: string;
  title: string;
  body: string;
  category: null | string;
  visibility: EVisibility;
  tags?: string[];
  createdAt: number;
  lastModified: number;
};