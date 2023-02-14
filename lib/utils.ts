import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';

import { setAuthenticatedUser } from '@/store/slices/authenticatedUserSlice';
import { setNotes } from '@/store/slices/notesSlice';
import { EVisibility } from '@/types/note';

import { notesCollection, usersCollection } from './firebase/firestore';

import type { useAppDispatch } from '@/store/hooks';
import type { TNoteWithId, TNote } from '@/types/note';
import type { TUser } from '@/types/user';
import type { User } from 'firebase/auth';

// Populate the store with the user's notes
// and set the authenticated user in case of a refresh
export async function isLoggedIn(
  user: User,
  dispatcher: ReturnType<typeof useAppDispatch>
): Promise<void> {
  await setAuthenticatedUserFunction(user, dispatcher);

  const q = query(notesCollection, where('owner', '==', user.uid));

  const querySnapshot = await getDocs(q);
  const temp: TNoteWithId[] = [];
  querySnapshot.forEach((noteDoc) => {
    const data = noteDoc.data();
    temp.push({
      ...data,
      id: noteDoc.id
    });
  });

  dispatcher(setNotes(temp));
}

// Set the authenticated user in the store
// Prevents inconsistent dispatch calls
export async function setAuthenticatedUserFunction(
  user: User,
  dispatcher: ReturnType<typeof useAppDispatch>
): Promise<void> {
  const userDocRef = doc(usersCollection, user.uid);
  const userDocSnap = await getDoc(userDocRef);
  const userDocData = userDocSnap.data() as TUser;

  dispatcher(
    setAuthenticatedUser({
      uid: user.uid,
      username: userDocData.username,
      email: user.email ?? '',
      emailVerified: user.emailVerified
    })
  );

  return Promise.resolve();
}

export const emptyNote: TNote = {
  owner: '',
  title: '',
  body: '',
  plainBody: '',
  category: '',
  tags: [],
  visibility: EVisibility.PUBLIC,
  lastModified: 0,
  createdAt: 0
};
