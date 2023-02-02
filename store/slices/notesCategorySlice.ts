import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: string[] = [];

export const noteSlice = createSlice({
  name: 'notesCategory',
  initialState: initialState,
  reducers: {
    setCategories: (_state, action: PayloadAction<string[]>) => {
      return action.payload;
    },
    updateCategory: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((category) => category === action.payload);
      if (index !== -1) state[index] = action.payload;
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((category) => category === action.payload);
      if (index !== -1) state.splice(index, 1);
    },
    addCategory: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((category) => category === action.payload);
      if (index === -1) state.push(action.payload);
    }
  }
});

export const { addCategory, setCategories, updateCategory, deleteCategory } =
  noteSlice.actions;

export default noteSlice.reducer;
