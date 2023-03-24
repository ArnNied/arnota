import { serverTimestamp, addDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiFillCopy } from 'react-icons/ai';

import { useInitializeState } from '@/lib/context/AuthContextProvider';
import { notesCollection } from '@/lib/firebase/firestore';
import { simplifyNoteData } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { addPersonalNote } from '@/store/slices/personalNotesSlice';

import SharedButton from '../shared/SharedButton';

import NoteActionModal from './NoteActionModal';

import type { TNote } from '@/types/note';
import type { WithFieldValue } from 'firebase/firestore';

type NoteTopbarButtonDuplicateProps = {
  note?: TNote;
};

export default function NoteTopbarButtonDuplicate({
  note
}: NoteTopbarButtonDuplicateProps): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { authUser } = useInitializeState();

  async function handleDuplicate(): Promise<void> {
    if (!note) return;

    if (!authUser) {
      await router.push('/login');

      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...noteWithoutId } = note;

      const duplicateNote: WithFieldValue<Omit<TNote, 'id'>> = {
        ...noteWithoutId,
        favoritedBy: [],
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
        owner: authUser.uid
      };

      const newDocRef = await addDoc(notesCollection, duplicateNote);

      const newDocSnap = await getDoc(newDocRef);

      if (newDocRef.id && newDocSnap.exists()) {
        const newDocData = simplifyNoteData(newDocSnap.data() as TNote);

        dispatch(addPersonalNote(newDocData));

        // TODO: Fix this hacky solution
        // This is a hacky solution to the problem of the router not
        // updating the page after the push. The problem is that the
        // router is not updating the page because the dispatch
        // is not finished updating the store.
        setTimeout(() => {
          router.push(`/nota/${newDocRef.id}`).catch((err) => {
            console.log('Error pushing to router', err);
          });
        }, 1000);
      }
    } catch (err) {
      console.log('Error duplicating note', err);
    }
  }

  return (
    <>
      <NoteActionModal
        title='Duplicate this note?'
        description='This will duplicate the everything except who favorited it.'
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
            text='Yes, duplicate this note'
            onClickHandler={handleDuplicate}
          />
        </div>
      </NoteActionModal>
      <SharedButton
        Icon={AiFillCopy}
        text='Duplicate'
        iconClassName='fill-darker/50 group-hover:fill-darker'
        onClickHandler={(): void => setModalIsOpen(true)}
      />
    </>
  );
}
