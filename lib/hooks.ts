// import { onAuthStateChanged } from 'firebase/auth';
// import { useEffect, useState } from 'react';

// import { useAppDispatch, useAppSelector } from '@/store/hooks';

// import { auth } from './firebase/core';
// import { isLoggedIn } from './utils';

// import type { PersonalNotesSliceInitialState } from '@/types/slice';
// import type { User } from 'firebase/auth';

// export function useInitializeState(): {
//   authUserLoading: boolean;
//   authUser: User | null | undefined;
//   personalNotesSelector: PersonalNotesSliceInitialState;
// } {
//   const dispatch = useAppDispatch();

//   const personalNotesSelector = useAppSelector((state) => state.personalNotes);

//   const [authUserLoading, setauthUserLoading] = useState(true);
//   const [authUser, setAuthUser] = useState<User | null>(auth.currentUser);

//   useEffect(() => {
//     const authUnsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setAuthUser(user);

//         if (personalNotesSelector.hasBeenFetched === false) {
//           isLoggedIn(user, dispatch).catch((err) => {
//             console.log('Error initializing state', err);
//           });
//         }
//       } else {
//         setAuthUser(null);
//       }

//       setauthUserLoading(false);
//     });

//     return () => authUnsubscribe();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [personalNotesSelector]);

//   return { authUserLoading, authUser, personalNotesSelector };
// }
