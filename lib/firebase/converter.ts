// import type { TNote } from '@/types/note';
// import type { TUser } from '@/types/user';
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions
} from 'firebase/firestore';

// export const notesConverter: FirestoreDataConverter<TNote> = {
//   toFirestore(note: TNote): DocumentData {
//     return note;
//   },
//   fromFirestore(
//     snapshot: QueryDocumentSnapshot,
//     options: SnapshotOptions
//   ): TNote {
//     const data = snapshot.data(options);
//     return data as TNote;
//   }
// };

// export const usersConverter: FirestoreDataConverter<TUser> = {
//   toFirestore(user: TUser): DocumentData {
//     return user;
//   },
//   fromFirestore(
//     snapshot: QueryDocumentSnapshot,
//     options: SnapshotOptions
//   ): TUser {
//     const data = snapshot.data(options);
//     return data as TUser;
//   }
// };

export function genericFirestoreDataConverter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore(item: T): DocumentData {
      return item as DocumentData;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): T {
      return snapshot.data(options) as T;
    }
  };
}
