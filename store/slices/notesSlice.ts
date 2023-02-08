import { createSlice } from '@reduxjs/toolkit';

import type { TNoteWithId } from '@/types/note';
import type { PayloadAction } from '@reduxjs/toolkit';

function setCategories(acc: string[], note: TNoteWithId): string[] {
  if (note.category && !acc.includes(note.category)) acc.push(note.category);
  return acc;
}

type TInitialState = {
  notes: TNoteWithId[];
  categories: ReturnType<typeof setCategories>;
  hasBeenFetched: boolean;
};

const initialState: TInitialState = {
  notes: [],
  categories: [],
  hasBeenFetched: false
};

export const noteSlice = createSlice({
  name: 'notes',
  initialState: initialState,
  reducers: {
    setNotes: (_state, action: PayloadAction<TNoteWithId[]>) => {
      return {
        notes: action.payload,
        categories: action.payload.reduce(setCategories, [] as string[]),
        hasBeenFetched: true
      };
    },
    updateNote: (state, action: PayloadAction<TNoteWithId>) => {
      const index = state.notes.findIndex(
        (note) => note.id === action.payload.id
      );
      if (index !== -1) {
        state.notes[index] = action.payload;
        state.categories = state.notes.reduce(setCategories, [] as string[]);
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      const index = state.notes.findIndex((note) => note.id === action.payload);
      if (index !== -1) {
        state.notes.splice(index, 1);
        state.categories = state.notes.reduce(setCategories, [] as string[]);
      }
    },
    addNote: (state, action: PayloadAction<TNoteWithId>) => {
      const index = state.notes.findIndex(
        (note) => note.id === action.payload.id
      );
      if (index === -1) {
        state.notes.push(action.payload);
        state.categories = state.notes.reduce(setCategories, [] as string[]);
      }
    }
  }
});

export const { addNote, setNotes, updateNote, deleteNote } = noteSlice.actions;

export default noteSlice.reducer;
