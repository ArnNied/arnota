import { doc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';

import { notesCollection } from '@/lib/firebase/firestore';
import { deletePersonalNote } from '@/store/slices/personalNotesSlice';

import SharedButton from '../shared/SharedButton';

import NoteActionModal from './NoteActionModal';

import type { useAppDispatch } from '@/store/hooks';
import type { TNote } from '@/types/note';
import type { NextRouter } from 'next/router';

type NoteTopbarIsOwnerProps = {
  router: NextRouter;
  dispatcher: ReturnType<typeof useAppDispatch>;
  note: TNote;
};

export default function NoteTopbarIsOwner({
  router,
  dispatcher,
  note
}: NoteTopbarIsOwnerProps): JSX.Element {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  async function handleDelete(): Promise<void> {
    const noteDocRef = doc(notesCollection, note.id);

    try {
      await deleteDoc(noteDocRef);

      dispatcher(deletePersonalNote(note.id));

      await router.push('/');
    } catch (err) {
      console.log('Error deleting note', err);
    }
  }

  return (
    <>
      <NoteActionModal
        title='Are you sure?'
        description='This is the final step to delete your note. This action is irreversible.'
        isOpen={deleteModalOpen}
        onCloseHandler={(): void => setDeleteModalOpen(false)}
      >
        <div className='flex flex-row space-x-4'>
          <SharedButton
            type='INVERTED'
            text='Cancel'
            onClickHandler={(): void => setDeleteModalOpen(false)}
          />
          <SharedButton
            type='PRIMARY'
            text='Yes, delete this note'
            onClickHandler={handleDelete}
          />
        </div>
      </NoteActionModal>

      {/* <SharedButton
        Icon={AiFillEdit}
        iconClassName='fill-darker/50 group-hover:fill-darker'
        text='Edit'
        href={`/nota/${note.id}/edit`}
      /> */}
      <SharedButton
        Icon={AiFillDelete}
        iconClassName='fill-red-600/50 group-hover:fill-red-600'
        text='Delete'
        onClickHandler={(): void => setDeleteModalOpen(true)}
      />
    </>
  );
}
