import { useEditor } from '@tiptap/react';
import { addDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';

import MainLayout from '@/components/layouts/MainLayout';
import InputWithLabel from '@/components/shared/InputWithLabel';
import Tiptap from '@/components/tiptap/Tiptap';
import { auth } from '@/lib/firebase/core';
import { notesCollection } from '@/lib/firebase/firestore';
import { configuredEditor } from '@/lib/tiptap';
import { isLoggedIn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { addNote, updateNote } from '@/store/slices/notesSlice';
import { EVisibility } from '@/types/note';

import type { TNoteWithId, TNote } from '@/types/note';
import type { Content } from '@tiptap/react';
import type { NextPage } from 'next';

const NoteEditPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { noteId } = router.query;

  const [user, loading, error] = useAuthState(auth);

  const personalNotesSelector = useAppSelector((state) => state.personalNotes);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState(EVisibility.PUBLIC);

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
      setTitle(toBeEdited.title);
      setCategory(toBeEdited.category as string);
      setTags(toBeEdited.tags.join(', '));
      setVisibility(toBeEdited.visibility);

      editor.commands.setContent(JSON.parse(toBeEdited.body) as Content);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, personalNotesSelector, editor]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const body = editor?.getJSON();
    const now: number = Date.now();

    const note: TNote = {
      owner: user?.uid as string,
      title: title || '',
      body: JSON.stringify(body),
      visibility: visibility,
      category: category !== '' ? category : null,
      tags: tags === '' ? [] : tags.split(','),
      createdAt: now,
      lastModified: now
    };

    const noteDocRef = doc(notesCollection, noteId as string);
    updateDoc(noteDocRef, note)
      .then(async () => {
        const noteWithId: TNoteWithId = {
          id: noteDocRef.id,
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
      <div className='h-full px-4 py-4'>
        <h2 className='font-bold text-3xl text-darker'>
          Start capturing your ideas
        </h2>
        <form onSubmit={handleSubmit} className='mt-4 space-y-2'>
          <InputWithLabel
            id='title'
            label='Title'
            placeholder='Your Captivating Title'
            additionalLabelClass='font-semibold text-lg'
            additionalInputClass='font-semibold text-lg'
            value={title}
            onChangeHandler={(e): void => setTitle(e.target.value)}
          />
          <div className='space-y-1'>
            <label className='font-semibold text-lg text-darker'>Body</label>
            <Tiptap editor={editor} />
          </div>
          <InputWithLabel
            id='category'
            label='Category'
            hint='(optional)'
            placeholder='Categorize your note for easy search'
            widthClass='w-72'
            value={category}
            onChangeHandler={(e): void => setCategory(e.target.value)}
          />
          <InputWithLabel
            id='tags'
            label='Tags'
            hint='(optional, separate with comma)'
            placeholder='Organize them further with multiple tags for composite search'
            value={tags}
            onChangeHandler={(e): void => setTags(e.target.value)}
          />
          <div className='space-y-1'>
            <label htmlFor='visibility' className='text-darker'>
              Visibility
            </label>
            <select
              id='visibility'
              name='visibility'
              className='block w-32 px-2 py-1 bg-white border-2 border-secondary focus:border-primary rounded focus:outline-none'
              defaultValue={visibility}
            >
              {Object.values(EVisibility).map((visibility) => (
                <option
                  key={visibility}
                  value={visibility}
                  onClick={(): void => setVisibility(visibility)}
                >
                  {visibility}
                </option>
              ))}
            </select>
          </div>

          <button
            type='submit'
            className='mt-2 px-2 py-1 bg-primary text-light rounded'
          >
            Save
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default NoteEditPage;
