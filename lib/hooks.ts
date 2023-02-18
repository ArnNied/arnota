import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { auth } from './firebase/core';
import { isLoggedIn } from './utils';

import type { PersonalNotesSliceInitialState } from '@/types/slice';
import type { User } from 'firebase/auth';

export function useInitializeState(): {
  authUser: User | null | undefined;
  personalNotesSelector: PersonalNotesSliceInitialState;
} {
  const dispatch = useAppDispatch();

  const [authUser, loading, error] = useAuthState(auth);

  const personalNotesSelector = useAppSelector((state) => state.personalNotes);

  useEffect(() => {
    if (loading) return;

    if (error) {
      console.log('Error getting authenticated user', error);
    } else if (authUser && personalNotesSelector.hasBeenFetched === false) {
      isLoggedIn(authUser, dispatch).catch((err) => {
        console.log('Error initializing state', err);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, loading, error, personalNotesSelector]);

  return { authUser, personalNotesSelector };
}
