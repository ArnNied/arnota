import { generateHTML } from '@tiptap/core';
import DOMPurify from 'dompurify';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import {
  AiFillEdit,
  AiFillDelete,
  AiFillHeart,
  AiOutlineHeart,
  AiFillCopy
} from 'react-icons/ai';
import { HiShare } from 'react-icons/hi';

import MainLayout from '@/components/layouts/MainLayout';
import Topbar from '@/components/shared/Topbar';
import TopbarAction from '@/components/shared/TopbarAction';
import { notesCollection, usersCollection } from '@/lib/firebase/firestore';
import { useInitializeState } from '@/lib/hooks';
import { configuredExtension } from '@/lib/tiptap';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deleteFavorite,
  addFavorite
} from '@/store/slices/favoritedNotesSlice';
import {
  deletePersonalNote,
  addPersonalNote
} from '@/store/slices/personalNotesSlice';

import type { TNote, TNoteWithId } from '@/types/note';
import type { TAuthenticatedUser, TUser } from '@/types/user';
import type { JSONContent } from '@tiptap/core';
import type { NextPage } from 'next';

const NoteDetailPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { personalNotesSelector } = useInitializeState();

  const authenticatedUserSelector = useAppSelector(
    (state) => state.authenticatedUser
  );

  const { noteId } = router.query;

  const [note, setNote] = useState<TNoteWithId>();
  const [owner, setOwner] = useState<TUser | TAuthenticatedUser>();
  const [favorited, setFavorited] = useState(false);

  const isOwner = useMemo(() => {
    if (!authenticatedUserSelector) return false;

    return (
      note?.owner !== undefined && note?.owner === authenticatedUserSelector.uid
    );
  }, [authenticatedUserSelector, note?.owner]);

  const output = useMemo(() => {
    if (!note) return null;

    try {
      const generatedHTML = generateHTML(
        JSON.parse(note?.body) as JSONContent,
        configuredExtension
      );

      const sanitized = DOMPurify.sanitize(generatedHTML);

      return sanitized;
    } catch (error) {
      return note.body;
    }
  }, [note]);

  function handleDelete(): void {
    const confirmStatus = confirm(
      "Are you sure you want to delete this note? You can't undo this action."
    );
    if (confirmStatus) {
      const noteDocRef = doc(notesCollection, note?.id);

      deleteDoc(noteDocRef)
        .then(() => {
          console.log('Note deleted');

          dispatch(deletePersonalNote(note?.id as string));

          router.push('/').catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log('Error deleting note', err);
        });
    }
  }

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
        dispatch(deleteFavorite(note?.id as string));
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
          owner: authenticatedUserSelector.uid
        };

        const newDocRef = await addDoc(notesCollection, duplicateNote);

        if (newDocRef.id) {
          dispatch(addPersonalNote({ id: newDocRef.id, ...duplicateNote }));

          await router.push(`/nota/${newDocRef.id}`);
        }
      } catch (err) {
        console.log('Error duplicating note', err);
      }
    }
  }

  useEffect(() => {
    if (!note) return;

    setFavorited(note.favoritedBy?.includes(authenticatedUserSelector.uid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.favoritedBy]);

  // TODO: Add a listener for counting the number of favorites
  useEffect(() => {
    if (!router.isReady || !authenticatedUserSelector) return;

    const isAnOwnedNote = personalNotesSelector.notes.find(
      (note) => note.id === noteId
    );

    if (isAnOwnedNote) {
      setOwner(authenticatedUserSelector);
      setNote(isAnOwnedNote);
    } else {
      const noteDocRef = doc(notesCollection, noteId as string);

      getDoc(noteDocRef)
        .then((noteDoc) => {
          if (noteDoc.exists()) {
            const noteDocData = noteDoc.data();

            const noteWithId: TNoteWithId = {
              id: noteId as string,
              ...noteDocData
            };

            setNote(noteWithId);

            // Get the owner of the note if it is not owned by the authenticated user
            const userDocRef = doc(usersCollection, noteDocData.owner);
            getDoc(userDocRef)
              .then((userDoc) => {
                if (userDoc.exists()) {
                  setOwner(userDoc.data());
                }
              })
              .catch((error) => {
                console.log('Error getting document:', error);
              });
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, personalNotesSelector, authenticatedUserSelector]);

  return (
    <MainLayout navbarCategories={personalNotesSelector.categories}>
      <Topbar
        left={
          <>
            By: {owner?.username}{' '}
            {isOwner && <span className='ml-1 text-secondary'>(You)</span>}
          </>
        }
        right={
          <>
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
          </>
        }
      />
      <div className='p-8 mt-12'>
        <h2 className='font-bold font-poppins text-4xl text-darker'>
          {note?.title}
        </h2>
        <div className='flex flex-row mt-2 space-x-4'>
          <h3 className='font-semibold text-sm italic text-secondary'>
            Last modified: {note?.lastModified}
          </h3>

          {note?.category && (
            <h3 className='font-semibold text-sm italic text-secondary'>
              Category: {note?.category}
            </h3>
          )}

          {note?.tags?.length !== 0 && (
            <h3 className='font-semibold text-sm italic text-secondary'>
              Tags: {note?.tags?.join(', ')}
            </h3>
          )}
        </div>

        <div className='mt-4 font-poppins text-darker whitespace-pre-wrap'>
          {parse(output ?? '')}
        </div>
      </div>
    </MainLayout>
  );
};

export default NoteDetailPage;
