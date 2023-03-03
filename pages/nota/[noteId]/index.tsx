import { generateHTML } from '@tiptap/core';
import DOMPurify from 'dompurify';
import { doc, getDoc } from 'firebase/firestore';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import MainLayout from '@/components/layouts/MainLayout';
import NoteActionModal from '@/components/note/NoteActionModal';
import NoteTopbarIsNotOwner from '@/components/note/NoteTopbarIsNotOwner';
import NoteTopbarIsOwner from '@/components/note/NoteTopbarIsOwner';
import ButtonGeneric from '@/components/shared/SharedButton';
import Topbar from '@/components/shared/Topbar';
import { notesCollection, usersCollection } from '@/lib/firebase/firestore';
import { useInitializeState } from '@/lib/hooks';
import { configuredExtension } from '@/lib/tiptap';
import { formatDate, simplifyNoteData } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type { TNote } from '@/types/note';
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

  const [note, setNote] = useState<TNote>();
  const [owner, setOwner] = useState<TUser | TAuthenticatedUser>();

  const [noteDetailsModalOpen, setNoteDetailsModalOpen] = useState(false);

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
            const noteDocData = simplifyNoteData(noteDoc.data());

            setNote(noteDocData);

            // Get the owner of the note if it is not owned by the authenticated user
            const userDocRef = doc(usersCollection, noteDocData.owner);
            getDoc(userDocRef)
              .then((userDoc) => {
                if (userDoc.exists()) {
                  setOwner(userDoc.data());
                }
              })
              .catch((error) => {
                console.log("Error getting owner's document:", error);
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
  }, [
    noteId,
    router.isReady,
    personalNotesSelector,
    authenticatedUserSelector
  ]);

  return (
    <MainLayout navbarCategories={personalNotesSelector.categories}>
      <Topbar align='between'>
        <p className='text-darker'>
          By: {owner?.username}
          {isOwner && <span className='ml-1 text-secondary'>(You)</span>}
        </p>
        <div className='flex flex-row space-x-2'>
          {note && (
            <NoteActionModal
              title='Details'
              isOpen={noteDetailsModalOpen}
              onCloseHandler={(): void => setNoteDetailsModalOpen(false)}
            >
              <div>
                <p>
                  Author: {owner?.username}
                  {isOwner && (
                    <span className='ml-1 text-secondary'>(You)</span>
                  )}
                </p>
                <p>Category: {note?.category}</p>
                <p>Tags: {note?.tags.join(', ')}</p>
                <p>Visibility: {note?.visibility}</p>
                <p>Date Created: {formatDate(note?.createdAt)}</p>
                <p>Last Modified: {formatDate(note?.lastModified)}</p>
              </div>
            </NoteActionModal>
          )}
          <ButtonGeneric
            Icon={AiOutlineInfoCircle}
            iconClassName='fill-secondary group-hover:fill-darker'
            text='Details'
            onClickHandler={(): void => setNoteDetailsModalOpen(true)}
          />
          {isOwner ? (
            <NoteTopbarIsOwner
              router={router}
              dispatcher={dispatch}
              note={note as TNote}
            />
          ) : (
            <NoteTopbarIsNotOwner
              router={router}
              dispatcher={dispatch}
              note={note as TNote}
              authenticatedUserSelector={authenticatedUserSelector}
            />
          )}
        </div>
      </Topbar>
      <div className='p-8 mt-12'>
        <h2 className='font-bold font-poppins text-4xl text-darker'>
          {note?.title}
        </h2>
        <div className='flex flex-row mt-2 space-x-4'>
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
