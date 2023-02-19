import { configureStore } from '@reduxjs/toolkit';

import authenticatedUserReducer from './slices/authenticatedUserSlice';
import personalNotesReducer from './slices/personalNotesSlice';
import favoritedNotesReducer from './slices/favoritedNotesSlice';

export const store = configureStore({
  reducer: {
    authenticatedUser: authenticatedUserReducer,
    personalNotes: personalNotesReducer,
    favoritedNotes: favoritedNotesReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
