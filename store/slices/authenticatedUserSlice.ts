import { createSlice } from '@reduxjs/toolkit';

import type { TAuthenticatedUser } from '@/types/user';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: TAuthenticatedUser = {
  username: '',
  email: '',
  emailVerified: false,
  uid: ''
};

export const authenticatedUserSlice = createSlice({
  name: 'authenticatedUser',
  initialState: initialState,
  reducers: {
    setAuthenticatedUser: (
      _state,
      action: PayloadAction<TAuthenticatedUser>
    ) => {
      return action.payload;
    },
    updateAuthenticatedUser: (
      state,
      action: PayloadAction<TAuthenticatedUser>
    ) => {
      return {
        ...state,
        ...action.payload
      };
    },
    clearAuthenticatedUser: () => initialState
  }
});

export const {
  setAuthenticatedUser,
  updateAuthenticatedUser,
  clearAuthenticatedUser
} = authenticatedUserSlice.actions;

export default authenticatedUserSlice.reducer;
