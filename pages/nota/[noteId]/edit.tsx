import { useEditor } from '@tiptap/react';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';

import MainLayout from '@/components/layouts/MainLayout';
import { CreateOrEdit } from '@/components/note/CreateOrEdit';
import { auth } from '@/lib/firebase/core';
import { notesCollection } from '@/lib/firebase/firestore';
import { configuredEditor } from '@/lib/tiptap';
import { emptyNote, isLoggedIn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { updateNote } from '@/store/slices/notesSlice';

import type { TNoteWithId, TNote } from '@/types/note';
import type { Content } from '@tiptap/react';
import type { NextPage } from 'next';

const NoteEditPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { noteId } = router.query;

  const [user, loading, error] = useAuthState(auth);

  const personalNotesSelector = useAppSelector((state) => state.personalNotes);

  const [placeholderNote, setPlaceholderNote] = useState<TNote>(emptyNote);

  const editor = useEditor(configuredEditor);

  useEffect(() => {
    if (loading) return;

    if (error) {
      console.log('Error getting authenticated user', error);
    } else if (user && personalNotesSelector.hasBeenFetched === false) {
      isLoggedIn(user, dispatch).catch((err) => {
        console.log('Error initializing state', err);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, error, personalNotesSelector]);

  useEffect(() => {
    if (
      !editor ||
      !router.isReady ||
      personalNotesSelector.hasBeenFetched == false
    ) {
      return;
    }

    const toBeEdited = personalNotesSelector.notes.find(
      (note) => note.id === noteId
    );

    if (toBeEdited) {
      // Vremove id from note so it doesn't get written to firestore
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...withoutId } = toBeEdited;

      setPlaceholderNote(withoutId as TNote);

      editor.commands.setContent(JSON.parse(toBeEdited.body) as Content);
    } else {
      console.log('Note not found');
      router.push('/').catch((err) => console.log(err));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, personalNotesSelector, editor]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const body = editor?.getJSON();
    const now: number = Date.now();

    const note: TNote = {
      ...placeholderNote,
      body: JSON.stringify(body),
      lastModified: now
    };

    const noteDocRef = doc(notesCollection, noteId as string);
    updateDoc(noteDocRef, note)
      .then(async () => {
        const noteWithId: TNoteWithId = {
          id: noteId as string,
          ...note
        };

        dispatch(updateNote(noteWithId));

        await router.push(`/nota/${noteDocRef.id}`);
      })
      .catch((error) => {
        console.log('Error in NoteEditPage handleSubmit', error);
      });
  }

  return (
    <MainLayout navbarCategories={personalNotesSelector.categories}>
      <CreateOrEdit
        note={placeholderNote}
        editor={editor}
        setNoteHandler={setPlaceholderNote}
        submitHandler={handleSubmit}
      />
    </MainLayout>
  );
};

export default NoteEditPage;
