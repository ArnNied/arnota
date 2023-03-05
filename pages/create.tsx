import { useEditor } from '@tiptap/react';
import { addDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import MainLayout from '@/components/layouts/MainLayout';
import AuthRequiredMixin from '@/components/mixin/AuthRequiredMixin';
import CreateOrEdit from '@/components/note/CreateOrEdit';
import { notesCollection } from '@/lib/firebase/firestore';
import { useInitializeState } from '@/lib/hooks';
import { configuredEditor } from '@/lib/tiptap';
import { simplifyNoteData } from '@/lib/utils';
import { addPersonalNote } from '@/store/slices/personalNotesSlice';
import { ENoteVisibility } from '@/types/note';

import type { TNote } from '@/types/note';
import type { WithFieldValue } from 'firebase/firestore';
import type { NextPage } from 'next';

const NoteCreatePage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { authUserLoading, authUser, personalNotesSelector } =
    useInitializeState();

  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState('');
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [noteVisibility, setNoteVisibility] = useState<ENoteVisibility>(
    ENoteVisibility.PRIVATE
  );

  const editor = useEditor(configuredEditor);

  async function handleSubmit(): Promise<void> {
    const body = editor?.getJSON();
    const plainBody = editor?.getText() as string;

    const _note: WithFieldValue<Omit<TNote, 'id'>> = {
      owner: authUser?.uid as string,
      title: noteTitle.trim(),
      category: noteCategory.trim(),
      tags: noteTags,
      body: JSON.stringify(body),
      plainBody: plainBody,
      visibility: noteVisibility,
      favoritedBy: [],
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp()
    };

    try {
      const noteDocRef = await addDoc(notesCollection, _note);

      const newDocSnap = await getDoc(noteDocRef);

      if (noteDocRef.id && newDocSnap.exists()) {
        const noteDocData = simplifyNoteData(newDocSnap.data() as TNote);

        console.log(noteDocData);
        dispatch(addPersonalNote(noteDocData));

        await router.push(`/nota/${noteDocRef.id}`);
      } else {
        console.log('Error in NoteCreatePage handleSubmit');
      }
    } catch (err) {
      console.log('Error in NoteCreatePage handleSubmit', err);
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

export default NoteCreatePage;
