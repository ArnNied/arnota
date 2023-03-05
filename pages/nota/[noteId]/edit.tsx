import { useEditor } from '@tiptap/react';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import MainLayout from '@/components/layouts/MainLayout';
import AuthRequiredMixin from '@/components/mixin/AuthRequiredMixin';
import CreateOrEdit from '@/components/note/CreateOrEdit';
import { notesCollection } from '@/lib/firebase/firestore';
import { useInitializeState } from '@/lib/hooks';
import { configuredEditor } from '@/lib/tiptap';
import { simplifyNoteData } from '@/lib/utils';
import { updatePersonalNote } from '@/store/slices/personalNotesSlice';
import { ENoteVisibility } from '@/types/note';

import type { TNote } from '@/types/note';
import type { Content } from '@tiptap/react';
import type { WithFieldValue } from 'firebase/firestore';
import type { NextPage } from 'next';

const NoteEditPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { noteId } = router.query;

  const { authUserLoading, authUser, personalNotesSelector } =
    useInitializeState();

  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState('');
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [noteVisibility, setNoteVisibility] = useState<ENoteVisibility>(
    ENoteVisibility.PRIVATE
  );

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

      setNoteTitle(toBeEdited.title);
      setNoteCategory(toBeEdited.category);
      setNoteTags(toBeEdited.tags);
      setNoteVisibility(toBeEdited.visibility);

      editor.commands.setContent(JSON.parse(toBeEdited.body) as Content);
    } else {
      console.log('Note not found');
      router.push('/').catch((err) => console.log(err));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, personalNotesSelector, editor]);

  async function handleSubmit(): Promise<void> {
    const body = editor?.getJSON();
    const plainBody = editor?.getText() as string;

    const note: WithFieldValue<Partial<TNote>> = {
      title: noteTitle.trim(),
      category: noteCategory.trim(),
      tags: noteTags,
      body: JSON.stringify(body),
      plainBody: plainBody,
      visibility: noteVisibility,
      lastModified: serverTimestamp()
    };

    try {
      const noteDocRef = doc(notesCollection, noteId as string);

      await updateDoc(noteDocRef, note);

      const newDocSnap = await getDoc(noteDocRef);
      const newDocData = simplifyNoteData(newDocSnap.data() as TNote);

      dispatch(updatePersonalNote(newDocData));

      await router.push(`/nota/${noteDocRef.id}`);
    } catch (error) {
      console.log('Error in NoteEditPage handleSubmit', error);
    }
  }

  return (
    <AuthRequiredMixin
      authUserLoading={authUserLoading}
      authUser={authUser}
      router={router}
    >
      <MainLayout navbarCategories={personalNotesSelector.categories}>
        <CreateOrEdit
          note={{
            title: {
              value: noteTitle,
              setter: setNoteTitle
            },
            category: {
              value: noteCategory,
              setter: setNoteCategory
            },
            tags: {
              value: noteTags,
              setter: setNoteTags
            },
            visibility: {
              value: noteVisibility,
              setter: setNoteVisibility
            }
          }}
          editor={editor}
          submitHandler={handleSubmit}
        />
      </MainLayout>
    </AuthRequiredMixin>
  );
};

export default NoteEditPage;
