import { createSlice } from '@reduxjs/toolkit';
import type { TNote } from '@/types/note';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: TNote[] = [];

export const noteSlice = createSlice({
  name: 'notes',
  initialState: initialState,
  reducers: {
    setNotes: (_state, action: PayloadAction<TNote[]>) => {
      return action.payload;
    },
    updateNote: (state, action: PayloadAction<TNote>) => {
      const index = state.findIndex((note) => note.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((note) => note.id === action.payload);
      if (index !== -1) state.splice(index, 1);
    },
    addNote: (state, action: PayloadAction<TNote>) => {
      const index = state.findIndex((note) => note.id === action.payload.id);
      if (index === -1) state.push(action.payload);
    }
  }
});

export const { setNotes, updateNote, deleteNote } = noteSlice.actions;

export default noteSlice.reducer;
