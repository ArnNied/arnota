import { HardBreak } from '@tiptap/extension-hard-break';
import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { addDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';

import MainLayout from '@/components/layouts/MainLayout';
import InputWithLabel from '@/components/shared/InputWithLabel';
import Tiptap from '@/components/tiptap/Tiptap';
import { auth } from '@/lib/firebase/core';
import { notesCollection } from '@/lib/firebase/firestore';
import { setNotesIfReduxStateIsEmpty } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { addNote } from '@/store/slices/notesSlice';
import { EVisibility } from '@/types/note';

import type { TNoteWithId } from '@/types/note';
import type { NextPage } from 'next';

const NoteCreatePage: NextPage = () => {
  const dispatch = useDispatch();

  const [user, loading, error] = useAuthState(auth);

  const personalNotesSelector = useAppSelector((state) => state.personalNotes);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState(EVisibility.PUBLIC);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false
      }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            'Mod-Enter': () => this.editor.commands.setHardBreak(),
            'Shift-Enter': () => this.editor.commands.setHardBreak(),
            Enter: () => this.editor.commands.setHardBreak()
          };
        }
      }),
      Placeholder.configure({
        placeholder: 'Record your ideas here'
      })
    ],
    editorProps: {
      attributes: {
        class: 'min-h-[10rem] px-2 p-1 rounded focus:outline-none'
      }
    },
    onFocus: () => {
      document
        .getElementById('tiptap-editor-container')
        ?.classList.replace('border-secondary', 'border-primary');
    },
    onBlur() {
      document
        .getElementById('tiptap-editor-container')
        ?.classList.replace('border-primary', 'border-secondary');
    }
  });

  useEffect(() => {
    if (loading) return;
    if (error) console.log('Error in NoteCreatePage useEffect', error);
    else if (user && personalNotesSelector.hasBeenFetched === false)
      void setNotesIfReduxStateIsEmpty(user.uid, dispatch);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, personalNotesSelector]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    const body = editor?.getJSON();
    const now: number = Date.now();

    const note = {
      owner: user?.uid as string,
      title: title !== '' ? title : 'Untitled',
      body: JSON.stringify(body),
      visibility: visibility,
      category: category !== '' ? category : null,
      tags: tags === '' ? [] : tags.split(','),
      createdAt: now,
      lastModified: now
    };

    const docRef = await addDoc(notesCollection, note);

    const noteWithId: TNoteWithId = {
      id: docRef.id,
      ...note
    };

    dispatch(addNote(noteWithId));
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
            onChangeHandler={(e): void => setCategory(e.target.value)}
          />
          <InputWithLabel
            id='tags'
            label='Tags'
            hint='(optional, separate with comma)'
            placeholder='Organize them further with multiple tags for composite search'
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
              defaultValue={EVisibility.PUBLIC}
            >
              <option
                value={EVisibility.PUBLIC}
                onClick={(): void => setVisibility(EVisibility.PUBLIC)}
              >
                Public
              </option>
              <option
                value={EVisibility.UNLISTED}
                onClick={(): void => setVisibility(EVisibility.UNLISTED)}
              >
                Unlisted
              </option>
              <option
                value={EVisibility.PRIVATE}
                onClick={(): void => setVisibility(EVisibility.PRIVATE)}
              >
                Private
              </option>
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
