import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './slices/notesSlice';
import notesCategoriesReducer from './slices/notesCategorySlice';

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    notesCategory: notesCategoriesReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
