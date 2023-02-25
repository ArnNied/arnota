import { useEditor } from '@tiptap/react';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import MainLayout from '@/components/layouts/MainLayout';
import CreateOrEdit from '@/components/note/CreateOrEdit';
import { notesCollection } from '@/lib/firebase/firestore';
import { useInitializeState } from '@/lib/hooks';
import { configuredEditor } from '@/lib/tiptap';
import { emptyNote } from '@/lib/utils';
import { updatePersonalNote } from '@/store/slices/personalNotesSlice';

import type { TNoteWithId, TNote } from '@/types/note';
import type { Content } from '@tiptap/react';
import type { NextPage } from 'next';

const NoteEditPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { noteId } = router.query;

  const { personalNotesSelector } = useInitializeState();

  const [placeholderNote, setPlaceholderNote] = useState<TNote>(emptyNote);

  const editor = useEditor(configuredEditor);

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

  async function handleSubmit(): Promise<void> {
    const body = editor?.getJSON();
    const now: number = Timestamp.now().toMillis();

    const note: TNote = {
      ...placeholderNote,
      body: JSON.stringify(body),
      lastModified: now
    };

    const noteDocRef = doc(notesCollection, noteId as string);

    try {
      await updateDoc(noteDocRef, note);

      const noteWithId: TNoteWithId = {
        id: noteId as string,
        ...note
      };

      dispatch(updatePersonalNote(noteWithId));

      await router.push(`/nota/${noteDocRef.id}`);
    } catch (error) {
      console.log('Error in NoteEditPage handleSubmit', error);
    }
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
