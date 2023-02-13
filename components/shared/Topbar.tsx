import { deleteDoc, doc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineEdit } from 'react-icons/ai';

import { notesCollection } from '@/lib/firebase/firestore';
import { useAppDispatch } from '@/store/hooks';
import { deleteNote } from '@/store/slices/notesSlice';

type TopbarProps = {
  noteId: string;
  ownerUsername: string;
  isOwner: boolean;
};

export default function Topbar({
  noteId,
  ownerUsername,
  isOwner
}: TopbarProps): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function handleDelete(): void {
    const confirmStatus = confirm(
      "Are you sure you want to delete this note? You can't undo this action."
    );
    if (confirmStatus) {
      const noteDocRef = doc(notesCollection, noteId);

      deleteDoc(noteDocRef)
        .then(async () => {
          console.log('Note deleted');

          dispatch(deleteNote(noteId));
          await router.push('/');
        })
        .catch((err) => {
          console.log('Error deleting note', err);
        });
    }
  }
  return (
    <div className='w-[inherit] flex flex-row px-4 py-2 bg-light text-darker fixed'>
      <div className='flex flex-row grow justify-start'>
        By: {ownerUsername}{' '}
        {isOwner && <span className='ml-1 text-secondary'>(You)</span>}
      </div>
      <div className='flex flex-row space-x-4'>
        {isOwner && (
          <>
            <Link
              href={`/nota/${noteId}/edit`}
              className='text-secondary hover:text-darker'
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className='text-secondary hover:text-darker'
            >
              Delete
            </button>
          </>
        )}
        {!isOwner && (
          <>
            <Link href='#' className='text-secondary hover:text-darker'>
              Like
            </Link>
            <Link href='#' className='text-secondary hover:text-darker'>
              Share
            </Link>
            <Link href='#' className='text-secondary hover:text-darker'>
              Copy
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
