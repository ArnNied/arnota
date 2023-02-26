import { doc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

import { notesCollection } from '@/lib/firebase/firestore';
import { deletePersonalNote } from '@/store/slices/personalNotesSlice';

import TopbarAction from '../shared/TopbarAction';

import NoteActionModal from './NoteActionModal';

import type { useAppDispatch } from '@/store/hooks';
import type { TNoteWithId } from '@/types/note';
import type { NextRouter } from 'next/router';

type NoteTopbarIsOwnerProps = {
  router: NextRouter;
  dispatcher: ReturnType<typeof useAppDispatch>;
  note: TNoteWithId;
};

export default function NoteTopbarIsOwner({
  router,
  dispatcher,
  note
}: NoteTopbarIsOwnerProps): JSX.Element {
  const [noteDeleteModalOpen, setNoteDeleteModalOpen] = useState(false);

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
        isOpen={noteDeleteModalOpen}
        onCloseHandler={(): void => setNoteDeleteModalOpen(false)}
      >
        <div className='flex flex-row space-x-4'>
          <button
            className='px-4 py-1 border border-primary text-primary rounded'
            onClick={(): void => setNoteDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className='px-4 py-1 bg-primary text-light rounded'
            onClick={handleDelete}
          >
            Yes, delete my note
          </button>
        </div>
      </NoteActionModal>
      <TopbarAction
        Icon={AiFillEdit}
        iconClassName='fill-darker/50 group-hover:fill-darker'
        text='Edit'
        href={`/nota/${note.id}/edit`}
      />
      <TopbarAction
        Icon={AiFillDelete}
        iconClassName='fill-red-600/50 group-hover:fill-red-600'
        text='Delete'
        onClickHandler={(): void => setNoteDeleteModalOpen(true)}
      />
    </>
  );
}
