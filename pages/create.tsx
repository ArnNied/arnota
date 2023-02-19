import { useEditor } from '@tiptap/react';
import { addDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import MainLayout from '@/components/layouts/MainLayout';
import CreateOrEdit from '@/components/note/CreateOrEdit';
import { notesCollection } from '@/lib/firebase/firestore';
import { useInitializeState } from '@/lib/hooks';
import { configuredEditor } from '@/lib/tiptap';
import { emptyNote } from '@/lib/utils';
import { addNote } from '@/store/slices/personalNotesSlice';

import type { TNoteWithId, TNote } from '@/types/note';
import type { NextPage } from 'next';

const NoteCreatePage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { authUser, personalNotesSelector } = useInitializeState();

  const [note, setNote] = useState<TNote>(emptyNote);

  const editor = useEditor(configuredEditor);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    const body = editor?.getJSON();
    const now: number = Timestamp.now().toMillis();

    const _note: TNote = {
      ...note,
      owner: authUser?.uid ?? '',
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
