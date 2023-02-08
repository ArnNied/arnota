import { collection } from 'firebase/firestore';

import { notesConverter } from './converter';
import { db } from './core';

export const notesCollection = collection(db, 'notes').withConverter(
  notesConverter
);
