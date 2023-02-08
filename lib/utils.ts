import { getDocs, query, where } from 'firebase/firestore';

import { setNotes } from '@/store/slices/notesSlice';

import { notesCollection } from './firebase/firestore';

import type { useAppDispatch } from '@/store/hooks';
import type { TNoteWithId } from '@/types/note';

export async function setNotesIfReduxStateIsEmpty(
  userUid: string,
  dispatcher: ReturnType<typeof useAppDispatch>
): Promise<void> {
  const q = query(notesCollection, where('owner', '==', userUid));

  const querySnapshot = await getDocs(q);
  const temp: TNoteWithId[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    temp.push({
      ...data,
      id: doc.id
    });
  });

  dispatcher(setNotes(temp));
}
