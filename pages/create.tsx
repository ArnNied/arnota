import { useEditor } from '@tiptap/react';
import { addDoc } from 'firebase/firestore';
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
import { addNote } from '@/store/slices/notesSlice';

import type { TNoteWithId, TNote } from '@/types/note';
import type { NextPage } from 'next';

const NoteCreatePage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [user, loading, error] = useAuthState(auth);

  const personalNotesSelector = useAppSelector((state) => state.personalNotes);

  const [note, setNote] = useState<TNote>(emptyNote);

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

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    const body = editor?.getJSON();
    const now: number = Date.now();

    const _note: TNote = {
      ...note,
      owner: user?.uid ?? '',
      body: JSON.stringify(body),
      plainBody: editor?.getText() ?? '',
      createdAt: now,
      lastModified: now
    };

    const noteDocRef = await addDoc(notesCollection, _note);

    if (noteDocRef.id) {
      const noteWithId: TNoteWithId = {
        id: noteDocRef.id,
        ..._note
      };

      dispatch(addNote(noteWithId));

      await router.push(`/nota/${noteDocRef.id}`);
    } else {
      console.log('Error in NoteCreatePage handleSubmit');
    }
  }

  return (
    <MainLayout navbarCategories={personalNotesSelector.categories}>
      <CreateOrEdit
        note={note}
        editor={editor}
        setNoteHandler={setNote}
        submitHandler={handleSubmit}
      />
    </MainLayout>
  );
};

export default NoteCreatePage;
