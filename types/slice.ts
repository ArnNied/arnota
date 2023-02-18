import type { TNoteWithId } from './note';

export type PersonalNotesSliceInitialState = {
  notes: TNoteWithId[];
  categories: TNoteWithId['category'][];
  hasBeenFetched: boolean;
};
