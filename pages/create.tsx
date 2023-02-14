import { useEditor } from '@tiptap/react';
import { addDoc } from 'firebase/firestore';
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
import { addNote } from '@/store/slices/notesSlice';
import { EVisibility } from '@/types/note';

import type { TNoteWithId, TNote } from '@/types/note';
import type { NextPage } from 'next';

const NoteCreatePage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [user, loading, error] = useAuthState(auth);

  const personalNotesSelector = useAppSelector((state) => state.personalNotes);

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [tags, setTags] = useState<string>('');
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

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    const body = editor?.getJSON();
    const now: number = Date.now();

    const note: TNote = {
      owner: user?.uid as string,
      title: title || '',
      body: JSON.stringify(body),
      plainBody: editor?.getText() ?? '',
      visibility: visibility,
      category: category || '',
      tags: tags === '' ? [] : tags.split(','),
      createdAt: now,
      lastModified: now
    };

    const noteDocRef = await addDoc(notesCollection, note);

    if (noteDocRef.id) {
      const noteWithId: TNoteWithId = {
        id: noteDocRef.id,
        ...note
      };

      dispatch(addNote(noteWithId));

      await router.push(`/nota/${noteDocRef.id}`);
    } else {
      console.log('Error in NoteCreatePage handleSubmit');
    }
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

export default NoteCreatePage;
