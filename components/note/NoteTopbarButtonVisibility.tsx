import { Listbox } from '@headlessui/react';
import { AiFillEye, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { HiOutlineChevronDown } from 'react-icons/hi';

import { ENoteVisibility } from '@/types/note';

import type { TEditableNote } from '@/types/note';
import type { Dispatch, SetStateAction } from 'react';

const NoteVisibilityIconMap = {
  [ENoteVisibility.PUBLIC]: (
    <AiFillEye size='1.25em' className='fill-darker group-hover:fill-white' />
  ),
  [ENoteVisibility.LIMITED]: (
    <AiOutlineEye
      size='1.25em'
      className='fill-darker group-hover:fill-white'
    />
  ),
  [ENoteVisibility.PRIVATE]: (
    <AiOutlineEyeInvisible
      size='1.25em'
      className='fill-darker group-hover:fill-white'
    />
  )
};

type NoteTopbarButtonVisibilityProps = {
  editableNote: TEditableNote;
  setEditableNote: Dispatch<SetStateAction<TEditableNote>>;
};

export default function NoteTopbarButtonVisibility({
  editableNote,
  setEditableNote
}: NoteTopbarButtonVisibilityProps): JSX.Element {
  return (
    <Listbox value={editableNote.visibility}>
      <div className='relative'>
        <Listbox.Button className='w-28 flex flex-row items-center justify-between p-1 text-start rounded'>
          <div className='flex flex-row items-center text-darker'>
            <span className='mr-1'>
              {editableNote.visibility &&
                NoteVisibilityIconMap[editableNote.visibility]}
            </span>{' '}
            {editableNote.visibility}
          </div>
          <HiOutlineChevronDown size='1.25em' className='fill' />
        </Listbox.Button>
        <Listbox.Options
          as='div'
          className='w-28 absolute mt-2 py-1 bg-white rounded overflow-hidden'
        >
          {Object.values(ENoteVisibility).map((visibility) => (
            <Listbox.Option
              as='button'
              key={visibility}
              value={visibility}
              onClick={(): void =>
                setEditableNote((prev) => {
                  return {
                    ...prev,
                    visibility
                  };
                })
              }
              className='flex flex-row group'
            >
              <div className='w-28 flex flex-row items-center p-1 group-hover:bg-primary group-hover:text-white text-start'>
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
  );
}
