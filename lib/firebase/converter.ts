import type { TNote } from '@/types/note';
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions
} from 'firebase/firestore';

export const notesConverter: FirestoreDataConverter<TNote> = {
  toFirestore(note: TNote): DocumentData {
    return note;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): TNote {
    const data = snapshot.data(options);
    return data as TNote;
  }
};
