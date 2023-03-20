import { updateDoc, arrayRemove, arrayUnion, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import { useInitializeState } from '@/lib/context/AuthContextProvider';
import { notesCollection } from '@/lib/firebase/firestore';
import { useAppDispatch } from '@/store/hooks';
import {
  deleteFavorite,
  addFavorite
} from '@/store/slices/favoritedNotesSlice';

import SharedButton from '../shared/SharedButton';

import type { TNote } from '@/types/note';

type NoteTopbarButtonFavoriteProps = {
  note?: TNote;
};

export default function NoteTopbarButtonFavorite({
  note
}: NoteTopbarButtonFavoriteProps): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { authUser } = useInitializeState();

  const [favorited, setFavorited] = useState(false);

  async function handleFavorite(): Promise<void> {
    if (!note) return;

    if (!authUser) {
      await router.push('/login');

      return;
    }

    const noteDocRef = doc(notesCollection, note.id);

    if (favorited) {
      try {
        await updateDoc(noteDocRef, {
          favoritedBy: arrayRemove(authUser.uid)
        });

        dispatch(deleteFavorite(note.id));

        setFavorited(false);
      } catch (err) {
        console.log('Error unfavoriting note', err);
      }
      return;
    } else {
      try {
        await updateDoc(noteDocRef, {
          favoritedBy: arrayUnion(authUser.uid)
        });

        dispatch(addFavorite(note));

        setFavorited(true);
      } catch (err) {
        console.log('Error favoriting note', err);
      }
    }
  }

  useEffect(() => {
    if (!note || !authUser) return;

    setFavorited(note.favoritedBy?.includes(authUser.uid));
  }, [note, authUser]);

  return (
    <>
      {favorited ? (
        <SharedButton
          Icon={AiFillHeart}
          iconClassName='fill-pink-500/50 group-hover:fill-pink-500'
          text='Unfavorite'
          onClickHandler={handleFavorite}
        />
      ) : (
        <SharedButton
          Icon={AiOutlineHeart}
          iconClassName='fill-pink-500/50 group-hover:fill-pink-500'
          text='Favorite'
          onClickHandler={handleFavorite}
        />
      )}
    </>
  );
}
