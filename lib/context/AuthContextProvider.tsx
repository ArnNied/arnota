import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '@/lib/firebase/core';
import { isLoggedIn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type { PersonalNotesSliceInitialState } from '@/types/slice';
import type { User } from 'firebase/auth';

type AuthContext = {
  authUserLoading: boolean;
  authUser: User | null;
  personalNotesSelector: PersonalNotesSliceInitialState;
};

type AuthContextProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthContextProvider({
  children
}: AuthContextProviderProps): JSX.Element {
  const dispatch = useAppDispatch();

  const personalNotesSelector = useAppSelector((state) => state.personalNotes);

  const [authUserLoading, setauthUserLoading] = useState(true);
  const [authUser, setAuthUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);

        if (personalNotesSelector.hasBeenFetched === false) {
          isLoggedIn(user, dispatch).catch((err) => {
            console.log('Error initializing state', err);
          });
        }
      } else {
        setAuthUser(null);
      }

      setauthUserLoading(false);
    });

    return () => authUnsubscribe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalNotesSelector]);

  const value: AuthContext = {
    authUserLoading,
    authUser,
    personalNotesSelector
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useInitializeState(): AuthContext {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useInitializeState must be used within an AuthContextProvider'
    );
  }

  return context;
}
