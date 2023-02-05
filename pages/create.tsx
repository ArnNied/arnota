import { HardBreak } from '@tiptap/extension-hard-break';
import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Navbar from '@/components/shared/Navbar';
import Tiptap from '@/components/shared/Tiptap';
import { useAppSelector } from '@/store/hooks';
import { addCategory } from '@/store/slices/notesCategorySlice';
import { addNote } from '@/store/slices/notesSlice';
import { EVisibility } from '@/types/note';

import type { NextPage } from 'next';

const NoteCreatePage: NextPage = () => {
  const dispatch = useDispatch();

  const notesCategorySelector = useAppSelector((state) => state.notesCategory);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState(EVisibility.PUBLIC);

  const editor = useEditor({
    extensions: [
      StarterKit,
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const body = editor?.getJSON();
    const now: number = Date.now();

    dispatch(
      addNote({
        id: nanoid(),
        title: title !== '' ? title : 'Untitled',
        body: JSON.stringify(body),
        visibility: visibility,
        category: category !== '' ? category : null,
        tags: tags === '' ? [] : tags.split(','),
        createdAt: now,
        lastModified: now
      })
    );

    if (category !== '') dispatch(addCategory(category));
  }

  return (
    <>
      <Navbar categories={notesCategorySelector} />
      <div className='w-4/5 flex flex-col ml-auto pb-12 bg-light'>
        <div className='h-full px-4 py-4'>
          <h2 className='font-bold text-3xl text-darker'>
            Start capturing your ideas
          </h2>
          <form onSubmit={handleSubmit} className='mt-4'>
            <div className='space-y-1'>
              <label htmlFor='title' className='text-darker'>
                Title
              </label>
              <input
                id='title'
                type='text'
                name='title'
                placeholder='Your Captivating Title'
                autoComplete='off'
                className='block w-full px-2 py-1 text-xl border-2 border-secondary focus:border-primary rounded focus:outline-none'
                onChange={(e): void => setTitle(e.target.value)}
              />
            </div>
            <div className='mt-2 space-y-1'>
              <label className='text-darker'>Body</label>
              <Tiptap editor={editor} />
            </div>
            <div className='mt-2 space-y-1'>
              <label htmlFor='category' className='text-darker'>
                Category <span className='text-gray-500'>(optional)</span>
              </label>
              <input
                id='category'
                type='text'
                name='category'
                placeholder='Categorize your note for easy search'
                autoComplete='off'
                className='block w-72 px-2 py-1 border-2 border-secondary focus:border-primary rounded focus:outline-none'
                onChange={(e): void => setCategory(e.target.value)}
              />
            </div>
            <div className='mt-2 space-y-1'>
              <label htmlFor='tags' className='text-darker'>
                Tags{' '}
                <span className='text-gray-500'>
                  (optional, separate with comma)
                </span>
              </label>
              <input
                id='tags'
                type='text'
                name='tags'
                placeholder='Organize them further with multiple tags for composite search'
                autoComplete='off'
                className='block w-full px-2 py-1 border-2 border-secondary focus:border-primary rounded focus:outline-none'
                onChange={(e): void => setTags(e.target.value)}
              />
            </div>
            <div className='mt-2 space-y-1'>
              <label htmlFor='visibility' className='text-darker'>
                Visibility
              </label>
              <select
                id='visibility'
                name='visibility'
                className='block w-32 px-2 py-1 bg-white border-2 border-secondary focus:border-primary rounded focus:outline-none'
              >
                <option onClick={(): void => setVisibility(EVisibility.PUBLIC)}>
                  Public
                </option>
                <option
                  onClick={(): void => setVisibility(EVisibility.UNLISTED)}
                >
                  Unlisted
                </option>
                <option
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
      </div>
    </>
  );
};

export default NoteCreatePage;
