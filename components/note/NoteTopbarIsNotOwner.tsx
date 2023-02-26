import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  AiFillHeart,
  AiOutlineHeart,
  AiFillCopy,
  AiOutlineLink,
  AiOutlineTwitter
} from 'react-icons/ai';
import { HiShare } from 'react-icons/hi';

import { notesCollection } from '@/lib/firebase/firestore';
import {
  deleteFavorite,
  addFavorite
} from '@/store/slices/favoritedNotesSlice';
import { addPersonalNote } from '@/store/slices/personalNotesSlice';

import TopbarAction from '../shared/TopbarAction';

import NoteActionModal from './NoteActionModal';

import type { useAppDispatch } from '@/store/hooks';
import type { TNoteWithId, TNote } from '@/types/note';
import type { TAuthenticatedUser } from '@/types/user';
import type { NextRouter } from 'next/router';

type NoteTopbarIsOwnerProps = {
  router: NextRouter;
  dispatcher: ReturnType<typeof useAppDispatch>;
  note: TNoteWithId;
  authenticatedUserSelector: TAuthenticatedUser;
};

export default function NoteTopbarIsNotOwner({
  router,
  dispatcher,
  note,
  authenticatedUserSelector
}: NoteTopbarIsOwnerProps): JSX.Element {
  const [favorited, setFavorited] = useState(false);
  const [noteShareModalOpen, setNoteShareModalOpen] = useState(false);
  const [noteDuplicateModalOpen, setNoteDuplicateModalOpen] = useState(false);

  async function handleFavorite(): Promise<void> {
    if (!authenticatedUserSelector || authenticatedUserSelector.uid === '') {
      await router.push('/login');
    }

    const noteDocRef = doc(notesCollection, note?.id);

    if (favorited) {
      try {
        await updateDoc(noteDocRef, {
          favoritedBy: arrayRemove(authenticatedUserSelector.uid)
        });

        dispatcher(deleteFavorite(note?.id));

        setFavorited(false);
      } catch (err) {
        console.log('Error unfavoriting note', err);
      }
      return;
    } else {
      try {
        await updateDoc(noteDocRef, {
          favoritedBy: arrayUnion(authenticatedUserSelector.uid)
        });

        dispatcher(addFavorite(note));

        setFavorited(true);
      } catch (err) {
        console.log('Error favoriting note', err);
      }
    }
  }

  async function handleShare(): Promise<void> {
    await navigator.clipboard.writeText(window.location.href);

    alert("Note's link copied to clipboard");
  }

  async function handleDuplicate(): Promise<void> {
    try {
      const now = Timestamp.now().toMillis();

      const duplicateNote: TNote = {
        ...(note as TNote),
        favoritedBy: [],
        createdAt: now,
        lastModified: now,
        owner: authenticatedUserSelector.uid
      };

      const newDocRef = await addDoc(notesCollection, duplicateNote);

      if (newDocRef.id) {
        setNoteDuplicateModalOpen(false);

        dispatcher(addPersonalNote({ ...duplicateNote, id: newDocRef.id }));

        // TODO: Fix this hacky solution
        // This is a hacky solution to the problem of the router not
        // updating the page after the push. The problem is that the
        // router is not updating the page because the dispatcher
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

  useEffect(() => {
    if (!note) return;

    setFavorited(note.favoritedBy?.includes(authenticatedUserSelector.uid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.favoritedBy]);

  return (
    <>
      <NoteActionModal
        title='Share this note'
        isOpen={noteShareModalOpen}
        onCloseHandler={(): void => setNoteShareModalOpen(false)}
      >
        <div className='w-full flex flex-row flex-wrap justify-center space-x-2'>
          <button
            type='button'
            title='Copy link to clipboard'
            className='w-12 h-12 flex items-center justify-center bg-gray-400 rounded-full'
            onClick={handleShare}
          >
            <AiOutlineLink size='1.5em' className='fill-white' />
          </button>
          <button
            type='button'
            title='Copy link to clipboard'
            className='w-12 h-12 flex items-center justify-center bg-blue-500 rounded-full'
            onClick={handleShare}
          >
            <AiOutlineTwitter size='1.5em' className='fill-white' />
          </button>
        </div>
      </NoteActionModal>
      <NoteActionModal
        title='Duplicate this note?'
        description='This will duplicate the everything except who favorited it.'
        isOpen={noteDuplicateModalOpen}
        onCloseHandler={(): void => setNoteDuplicateModalOpen(false)}
      >
        <div className='flex flex-row space-x-4'>
          <button
            className='px-4 py-1 border border-primary text-primary rounded'
            onClick={(): void => setNoteDuplicateModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className='px-4 py-1 bg-primary text-light rounded'
            onClick={handleDuplicate}
          >
            Yes, duplicate this note
          </button>
        </div>
      </NoteActionModal>
      {favorited ? (
        <TopbarAction
          Icon={AiFillHeart}
          iconClassName='fill-pink-500/50 group-hover:fill-pink-500'
          text='Unfavorite'
          onClickHandler={handleFavorite}
        />
      ) : (
        <TopbarAction
          Icon={AiOutlineHeart}
          iconClassName='fill-pink-500/50 group-hover:fill-pink-500'
          text='Favorite'
          onClickHandler={handleFavorite}
        />
      )}
      <TopbarAction
        Icon={HiShare}
        text='Share'
        iconClassName='fill-green-500/75 group-hover:fill-green-500'
        onClickHandler={(): void => setNoteShareModalOpen(true)}
      />
      <TopbarAction
        Icon={AiFillCopy}
        text='Duplicate'
        iconClassName='fill-darker/50 group-hover:fill-darker'
        onClickHandler={(): void => setNoteDuplicateModalOpen(true)}
      />
    </>
  );
}
