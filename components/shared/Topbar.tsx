import {
  addDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import {
  AiFillCopy,
  AiFillHeart,
  AiOutlineHeart,
  AiFillEdit,
  AiFillDelete
} from 'react-icons/ai';
import { HiShare } from 'react-icons/hi';

import { notesCollection } from '@/lib/firebase/firestore';
import { useAppDispatch } from '@/store/hooks';
import {
  addFavorite,
  deleteFavorite
} from '@/store/slices/favoritedNotesSlice';
import { addNote, deleteNote } from '@/store/slices/personalNotesSlice';

import TopbarAction from './TopbarAction';

import type { TNote, TNoteWithId } from '@/types/note';
import type { TAuthenticatedUser, TUser } from '@/types/user';

type TopbarProps = {
  authenticatedUser: TAuthenticatedUser;
  owner: TAuthenticatedUser | TUser;
  note?: TNoteWithId;
};

export default function Topbar({
  authenticatedUser,
  owner,
  note
}: TopbarProps): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [favorited, setFavorited] = useState(false);

  const isOwner = useMemo(() => {
    if (!authenticatedUser) return false;

    return note?.owner !== undefined && note?.owner === authenticatedUser.uid;
  }, [authenticatedUser, note?.owner]);

  useEffect(() => {
    if (!note) return;

    setFavorited(note.favoritedBy?.includes(authenticatedUser.uid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.favoritedBy]);

  function handleDelete(): void {
    const confirmStatus = confirm(
      "Are you sure you want to delete this note? You can't undo this action."
    );
    if (confirmStatus) {
      const noteDocRef = doc(notesCollection, note?.id);

      deleteDoc(noteDocRef)
        .then(async () => {
          console.log('Note deleted');

          dispatch(deleteNote(note?.id as string));

          await router.push('/');
        })
        .catch((err) => {
          console.log('Error deleting note', err);
        });
    }
  }

  async function handleFavorite(): Promise<void> {
    if (!authenticatedUser || authenticatedUser.uid === '') {
      await router.push('/login');
    }

    const noteDocRef = doc(notesCollection, note?.id);

    if (favorited) {
      try {
        await updateDoc(noteDocRef, {
          favoritedBy: arrayRemove(authenticatedUser.uid)
        });
        dispatch(deleteFavorite(note?.id as string));
        setFavorited(false);
      } catch (err) {
        console.log('Error unfavoriting note', err);
      }
      return;
    } else {
      try {
        await updateDoc(noteDocRef, {
          favoritedBy: arrayUnion(authenticatedUser.uid)
        });
        dispatch(addFavorite(note as TNoteWithId));
        setFavorited(true);
      } catch (err) {
        console.log('Error favoriting note', err);
      }
    }
  }

  async function handleShare(): Promise<void> {
    // TODO: Implement UI popup for sharing
    await navigator.clipboard.writeText(window.location.href);

    alert("Note's link copied to clipboard");
  }

  async function handleDuplicate(): Promise<void> {
    // TODO: Implement UI popup for duplicating a note
    const confirmed = confirm('Duplicate the note and add it to your notes?');

    if (confirmed) {
      try {
        const now = Timestamp.now().toMillis();

        const duplicateNote: TNote = {
          ...(note as TNote),
          favoritedBy: [],
          createdAt: now,
          lastModified: now,
          owner: authenticatedUser.uid
        };

        const newDocRef = await addDoc(notesCollection, duplicateNote);

        if (newDocRef.id) {
          dispatch(addNote({ id: newDocRef.id, ...duplicateNote }));

          await router.push(`/nota/${newDocRef.id}`);
        }
      } catch (err) {
        console.log('Error duplicating note', err);
      }
    }
  }

  return (
    <div className='w-[inherit] flex flex-row px-4 py-2 bg-light text-darker fixed'>
      <div className='flex flex-row grow justify-start'>
        By: {owner.username}{' '}
        {isOwner && <span className='ml-1 text-secondary'>(You)</span>}
      </div>
      <div className='flex flex-row space-x-4'>
        {isOwner ? (
          <>
            <TopbarAction
              Icon={AiFillEdit}
              iconClassName='fill-darker/50 group-hover:fill-darker'
              text='Edit'
              href={`/nota/${note?.id as string}/edit`}
            />
            <TopbarAction
              Icon={AiFillDelete}
              iconClassName='fill-red-600/50 group-hover:fill-red-600'
              text='Delete'
              onClickHandler={handleDelete}
            />
          </>
        ) : (
          <>
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
              onClickHandler={handleShare}
            />
            <TopbarAction
              Icon={AiFillCopy}
              text='Duplicate'
              iconClassName='fill-darker/50 group-hover:fill-darker'
              onClickHandler={handleDuplicate}
            />
          </>
        )}
      </div>
    </div>
  );
}
