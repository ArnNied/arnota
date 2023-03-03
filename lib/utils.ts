import {
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where
} from 'firebase/firestore';

import { setAuthenticatedUser } from '@/store/slices/authenticatedUserSlice';
import { setPersonalNotes } from '@/store/slices/personalNotesSlice';

import { notesCollection, usersCollection } from './firebase/firestore';

import type { useAppDispatch } from '@/store/hooks';
import type { PlainTimestamp, TNote } from '@/types/note';
import type { TUser } from '@/types/user';
import type { User } from 'firebase/auth';

export function formatDate(param: Date): string;
export function formatDate(param: PlainTimestamp): string;

export function formatDate(param: Date | PlainTimestamp): string {
  if (param instanceof Date) {
    return param.toISOString().replace('T', ' ').slice(0, 19);
  } else {
    return new Timestamp(param.seconds, param.nanoseconds)
      .toDate()
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19);
  }
}

export function simplifyNoteData(note: TNote): TNote {
  return {
    ...note,
    createdAt: { ...note.createdAt } as PlainTimestamp,
    lastModified: { ...note.lastModified } as PlainTimestamp
  };
}

// Populate the store with the user's notes
// and set the authenticated user in case of a refresh
export async function isLoggedIn(
  user: User,
  dispatcher: ReturnType<typeof useAppDispatch>
): Promise<void> {
  await setAuthenticatedUserFunction(user, dispatcher);

  const q = query(notesCollection, where('owner', '==', user.uid));

  const querySnapshot = await getDocs(q);
  const temp: TNote[] = [];
  querySnapshot.forEach((noteDoc) => {
    const data = simplifyNoteData(noteDoc.data());
    temp.push(data);
  });

  dispatcher(setPersonalNotes(temp));
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
