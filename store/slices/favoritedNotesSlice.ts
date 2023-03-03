import { createSlice } from '@reduxjs/toolkit';

import type { TNote } from '@/types/note';
import type { PayloadAction } from '@reduxjs/toolkit';

type TInitialState = {
  notes: TNote[];
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
    setFavorites: (state, action: PayloadAction<TNote[]>) => {
      return {
        notes: action.payload,
        hasBeenFetched: true
      };
    },
    addFavorite: (state, action: PayloadAction<TNote>) => {
      const index = state.notes.findIndex(
        (note) => note.id === action.payload.id
      );

      if (index === -1) {
        state.notes.push(action.payload);
      }
    },
    updateFavorite: (state, action: PayloadAction<TNote>) => {
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
    },
    clearFavorites: () => initialState
  }
});

export const { setFavorites, addFavorite, deleteFavorite, clearFavorites } =
  noteSlice.actions;

export default noteSlice.reducer;
