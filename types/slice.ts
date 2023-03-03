import type { TNote } from './note';

export type PersonalNotesSliceInitialState = {
  notes: TNote[];
  categories: TNote['category'][];
  hasBeenFetched: boolean;
};
