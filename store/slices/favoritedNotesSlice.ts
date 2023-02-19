import { createSlice } from '@reduxjs/toolkit';

import type { TNoteWithId } from '@/types/note';
import type { PersonalNotesSliceInitialState } from '@/types/slice';
import type { PayloadAction } from '@reduxjs/toolkit';

type TInitialState = {
  notes: TNoteWithId[];
  hasBeenFetched: boolean;
};
const initialState: TInitialState = {
  notes: [],
  hasBeenFetched: false
};

export const noteSlice = createSlice({
  name: 'favoritedNotes',
  initialState: initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<TNoteWithId[]>) => {
      return {
        notes: action.payload,
        hasBeenFetched: true
      };
    },
    addFavorite: (state, action: PayloadAction<TNoteWithId>) => {
      const index = state.notes.findIndex(
        (note) => note.id === action.payload.id
      );

      if (index === -1) {
        state.notes.push(action.payload);
      }
    },
    updateFavorite: (state, action: PayloadAction<TNoteWithId>) => {
      const index = state.notes.findIndex(
        (note) => note.id === action.payload.id
      );

      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteFavorite: (state, action: PayloadAction<string>) => {
      const index = state.notes.findIndex((note) => note.id === action.payload);

      if (index !== -1) {
        state.notes.splice(index, 1);
      }
    }
  }
});

export const { setFavorites, addFavorite, deleteFavorite } = noteSlice.actions;

export default noteSlice.reducer;
