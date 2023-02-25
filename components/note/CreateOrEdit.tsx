import { Listbox } from '@headlessui/react';
import { AiFillEye, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { HiOutlineChevronDown } from 'react-icons/hi';

import { ENoteVisibility } from '@/types/note';

import InputWithLabel from '../shared/InputWithLabel';
import Topbar from '../shared/Topbar';
import Tiptap from '../tiptap/Tiptap';

import type { TNote } from '@/types/note';
import type { useEditor } from '@tiptap/react';

export const NoteVisibilityIconMap = {
  [ENoteVisibility.PUBLIC]: <AiFillEye size='1.25em' className='fill-darker' />,
  [ENoteVisibility.LIMITED]: (
    <AiOutlineEye size='1.25em' className='fill-darker' />
  ),
  [ENoteVisibility.PRIVATE]: (
    <AiOutlineEyeInvisible size='1.25em' className='fill-darker' />
  )
};

type SearchOrEditProps = {
  note: TNote;
  editor: ReturnType<typeof useEditor>;
  setNoteHandler: (note: TNote) => void;
  submitHandler: () => void;
};

export default function CreateOrEdit({
  note,
  editor,
  setNoteHandler,
  submitHandler
}: SearchOrEditProps): JSX.Element {
  return (
    <>
      <Topbar
        right={
          <>
            <Listbox value={note.visibility}>
              <div>
                <Listbox.Button className='w-32 flex flex-row items-center justify-between p-1 text-start rounded'>
                  <div className='flex flex-row items-center'>
                    <span className='mr-1'>
                      {NoteVisibilityIconMap[note.visibility]}
                    </span>{' '}
                    {note.visibility}
                  </div>
                  <HiOutlineChevronDown size='1.25em' className='fill' />
                </Listbox.Button>
                <Listbox.Options as='div' className='absolute mt-1'>
                  {Object.values(ENoteVisibility).map((visibility) => (
                    <Listbox.Option
                      as='button'
                      key={visibility}
                      value={visibility}
                      onClick={(): void =>
                        setNoteHandler({ ...note, visibility: visibility })
                      }
                      className='flex flex-row bg-white rounded'
                    >
                      <div className='w-32 flex flex-row items-center p-1 hover:bg-primary/30 text-start'>
                        <span className='mr-1'>
                          {NoteVisibilityIconMap[visibility]}
                        </span>{' '}
                        {visibility}
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
            <button
              type='button'
              onClick={submitHandler}
              className='px-6 py-1 bg-primary font- text-light rounded'
            >
              SAVE
            </button>
          </>
        }
      />

      <div className='p-8 mt-12 space-y-4'>
        <input
          type='text'
          placeholder='Title: Your Captivating Title'
          className='w-full py-1 bg-light font-bold text-2xl text-darker border-b-2 border-secondary focus:border-primary focus:outline-none'
          value={note.title}
          onChange={(e): void =>
            setNoteHandler({ ...note, title: e.target.value })
          }
        />
        <div className='flex flex-row space-x-4'>
          <input
            type='text'
            placeholder='Category (optional)'
            className='w-72 py-1 bg-light text-darker border-b-2 border-secondary focus:border-primary focus:outline-none'
            value={note.category}
            onChange={(e): void =>
              setNoteHandler({ ...note, category: e.target.value })
            }
          />
          <input
            type='text'
            placeholder='Tags (optional, separate with comma)'
            className='w-full py-1 bg-light text-darker border-b-2 border-secondary focus:border-primary focus:outline-none'
            value={note.tags.map((tag) => tag.trim()).join(', ')}
            onChange={(e): void =>
              setNoteHandler({ ...note, tags: e.target.value.split(', ') })
            }
          />
        </div>
        <Tiptap editor={editor} />
      </div>
    </>
  );
}
