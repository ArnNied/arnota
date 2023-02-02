import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import Tiptap from '@/components/shared/Tiptap';
import Navbar from '@/components/shared/Navbar';
import { addNote } from '@/store/slices/notesSlice';
import type { NextPage } from 'next';

const NoteCreatePage: NextPage = () => {
  const dispatch = useDispatch();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Record Your Ideas Here'
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

    const title: string = (document.getElementById('title') as HTMLInputElement)
      .value;
    const body = editor?.getJSON();

    dispatch(
      addNote({
        id: nanoid(),
        title,
        body: JSON.stringify(body),
        category: 'personal'
      })
    );

    console.log(title, body);
  }

  return (
    <>
      <Navbar />
      <div className='w-4/5 flex flex-col ml-auto pb-12 bg-light'>
        <div className='h-full px-4 py-4'>
          <h2 className='font-bold text-3xl text-darker'>
            Start capturing your ideas
          </h2>
          <form onSubmit={handleSubmit} className='mt-4'>
            <div>
              <input
                id='title'
                type='text'
                name='title'
                placeholder='Title: Inspire Your Creative Thinking'
                autoComplete='off'
                className='w-full mt-1 px-2 py-1 rounded border-2 border-secondary focus:border-primary focus:outline-none'
              />
            </div>
            <div className='mt-2'>
              <Tiptap editor={editor} />
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
