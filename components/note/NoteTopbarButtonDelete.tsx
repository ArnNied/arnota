import { doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';

import { notesCollection } from '@/lib/firebase/firestore';
import { useAppDispatch } from '@/store/hooks';
import { deletePersonalNote } from '@/store/slices/personalNotesSlice';

import SharedButton from '../shared/SharedButton';

import NoteActionModal from './NoteActionModal';

import type { TNote } from '@/types/note';

type NoteTopbarButtonDeleteProps = {
  noteId: TNote['id'];
};

export default function NoteTopbarButtonDelete({
  noteId
}: NoteTopbarButtonDeleteProps): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  async function handleDelete(): Promise<void> {
    const noteDocRef = doc(notesCollection, noteId);

    try {
      await deleteDoc(noteDocRef);

      dispatch(deletePersonalNote(noteId));

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
        isOpen={modalIsOpen}
        onCloseHandler={(): void => setModalIsOpen(false)}
      >
        <div className='flex flex-row space-x-4'>
          <SharedButton
            type='INVERTED'
            text='Cancel'
            onClickHandler={(): void => setModalIsOpen(false)}
          />
          <SharedButton
            type='PRIMARY'
            text='Yes, delete this note'
            onClickHandler={handleDelete}
          />
        </div>
      </NoteActionModal>
      <SharedButton
        Icon={AiFillDelete}
        iconClassName='fill-red-600/50 group-hover:fill-red-600'
        text='Delete'
        onClickHandler={(): void => setModalIsOpen(true)}
      />
    </>
  );
}
