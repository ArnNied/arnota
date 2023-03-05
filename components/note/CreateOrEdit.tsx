import { Listbox } from '@headlessui/react';
import { AiFillEye, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { HiOutlineChevronDown } from 'react-icons/hi';

import { ENoteVisibility } from '@/types/note';

import SharedButton from '../shared/SharedButton';
import Topbar from '../shared/Topbar';
import Tiptap from '../tiptap/Tiptap';

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
  note: {
    title: {
      value: string;
      setter: React.Dispatch<React.SetStateAction<string>>;
    };
    category: {
      value: string;
      setter: React.Dispatch<React.SetStateAction<string>>;
    };
    tags: {
      value: string[];
      setter: React.Dispatch<React.SetStateAction<string[]>>;
    };
    visibility: {
      value: ENoteVisibility;
      setter: React.Dispatch<React.SetStateAction<ENoteVisibility>>;
    };
  };
  editor: ReturnType<typeof useEditor>;
  submitHandler: () => void;
};

export default function CreateOrEdit({
  note,
  editor,
  submitHandler
}: SearchOrEditProps): JSX.Element {
  return (
    <>
      <Topbar align='right'>
        <div className='flex flex-row space-x-2'>
          <Listbox value={note.visibility}>
            <div>
              <Listbox.Button className='w-32 flex flex-row items-center justify-between p-1 text-start rounded'>
                <div className='flex flex-row items-center'>
                  <span className='mr-1'>
                    {NoteVisibilityIconMap[note.visibility.value]}
                  </span>{' '}
                  {note.visibility.value}
                </div>
                <HiOutlineChevronDown size='1.25em' className='fill' />
              </Listbox.Button>
              <Listbox.Options
                as='div'
                className='w-[inherit] absolute mt-3 p-1 bg-white rounded overflow-hidden'
              >
                {Object.values(ENoteVisibility).map((visibility) => (
                  <Listbox.Option
                    as='button'
                    key={visibility}
                    value={visibility}
                    onClick={(): void =>
                      note.visibility.setter(visibility as ENoteVisibility)
                    }
                    className='flex flex-row'
                  >
                    <div className='w-32 flex flex-row items-center p-1 hover:bg-primary/30 text-start rounded'>
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
          <SharedButton
            type='PRIMARY'
            text='Save'
            onClickHandler={submitHandler}
          />
        </div>
      </Topbar>

      <div className='p-8 mt-12 space-y-4'>
        <input
          type='text'
          placeholder='Title: Your Captivating Title'
          className='w-full py-1 bg-light font-bold text-2xl text-darker border-b-2 border-secondary focus:border-primary focus:outline-none'
          value={note.title.value}
          onChange={(e): void => note.title.setter(e.target.value.trimStart())}
        />
        <div className='flex flex-row space-x-4'>
          <input
            type='text'
            placeholder='Category (optional)'
            className='w-72 py-1 bg-light text-darker border-b-2 border-secondary focus:border-primary focus:outline-none'
            value={note.category.value}
            onChange={(e): void =>
              note.category.setter(e.target.value.trimStart())
            }
          />
          <input
            type='text'
            placeholder='Tags (optional, separate with comma)'
            className='w-full py-1 bg-light text-darker border-b-2 border-secondary focus:border-primary focus:outline-none'
            value={note.tags.value.map((tag) => tag.trim()).join(', ')}
            onChange={(e): void => note.tags.setter(e.target.value.split(', '))}
          />
        </div>
        <Tiptap editor={editor} />
      </div>
    </>
  );
}
