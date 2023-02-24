import { generateHTML } from '@tiptap/core';
import DOMPurify from 'dompurify';
import { doc, getDoc } from 'firebase/firestore';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import MainLayout from '@/components/layouts/MainLayout';
import Topbar from '@/components/shared/Topbar';
import { notesCollection, usersCollection } from '@/lib/firebase/firestore';
import { useInitializeState } from '@/lib/hooks';
import { configuredExtension } from '@/lib/tiptap';
import { useAppSelector } from '@/store/hooks';

import type { TNoteWithId } from '@/types/note';
import type { TAuthenticatedUser, TUser } from '@/types/user';
import type { JSONContent } from '@tiptap/core';
import type { NextPage } from 'next';

const NoteDetailPage: NextPage = () => {
  const router = useRouter();

  const { personalNotesSelector } = useInitializeState();

  const authenticatedUserSelector = useAppSelector(
    (state) => state.authenticatedUser
  );

  const { noteId } = router.query;

  const [note, setNote] = useState<TNoteWithId>();
  const [owner, setOwner] = useState<TUser | TAuthenticatedUser>();

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
        authenticatedUser={authenticatedUserSelector}
        owner={owner ?? ({} as TUser | TAuthenticatedUser)}
        note={note ?? ({} as TNoteWithId)}
      />
      <div className='px-8 py-4 mt-12'>
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
