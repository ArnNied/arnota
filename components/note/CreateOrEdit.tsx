import { EVisibility } from '@/types/note';

import InputWithLabel from '../shared/InputWithLabel';
import Tiptap from '../tiptap/Tiptap';

import type { TNote } from '@/types/note';
import type { useEditor } from '@tiptap/react';

type SearchOrEditProps = {
  note: TNote;
  editor: ReturnType<typeof useEditor>;
  setNoteHandler: (note: TNote) => void;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function CreateOrEdit({
  note,
  editor,
  setNoteHandler,
  submitHandler
}: SearchOrEditProps): JSX.Element {
  return (
    <div className='px-4 py-4'>
      <h2 className='font-bold text-3xl text-darker'>
        Start capturing your ideas
      </h2>
      <form onSubmit={submitHandler} className='mt-4 space-y-2'>
        <InputWithLabel
          id='title'
          label='Title'
          placeholder='Your Captivating Title'
          additionalLabelClass='font-semibold text-lg'
          additionalInputClass='font-semibold text-lg'
          value={note.title}
          onChangeHandler={(e): void =>
            setNoteHandler({ ...note, title: e.target.value })
          }
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
          value={note.category}
          onChangeHandler={(e): void =>
            setNoteHandler({ ...note, category: e.target.value })
          }
        />
        <InputWithLabel
          id='tags'
          label='Tags'
          hint='(optional, separate with comma)'
          placeholder='Organize them further with multiple tags for composite search'
          value={note.tags.map((tag) => tag.trim()).join(', ')}
          onChangeHandler={(e): void =>
            setNoteHandler({ ...note, tags: e.target.value.split(', ') })
          }
        />
        <div className='space-y-1'>
          <label htmlFor='visibility' className='text-darker'>
            Visibility
          </label>
          <select
            key={note.visibility}
            id='visibility'
            name='visibility'
            className='block w-32 px-2 py-1 bg-white border-2 border-secondary focus:border-primary rounded focus:outline-none'
            defaultValue={note.visibility}
          >
            {Object.values(EVisibility).map((visibility) => (
              <option
                key={visibility}
                value={visibility}
                onClick={(): void =>
                  setNoteHandler({ ...note, visibility: visibility })
                }
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
  );
}
