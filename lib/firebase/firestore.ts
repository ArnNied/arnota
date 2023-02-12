import { collection } from 'firebase/firestore';

import { genericFirestoreDataConverter } from './converter';
import { db } from './core';

import type { TNote } from '@/types/note';
import type { TUser } from '@/types/user';

export const notesCollection = collection(db, 'notes').withConverter(
  genericFirestoreDataConverter<TNote>()
);

export const usersCollection = collection(db, 'users').withConverter(
  genericFirestoreDataConverter<TUser>()
);
