import { Listbox, Popover } from '@headlessui/react';
import { clsx } from 'clsx';
import {
  AiFillEye,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineInfoCircle
} from 'react-icons/ai';
import { HiOutlineChevronDown } from 'react-icons/hi';

import { convertTagsListToString, formatDate } from '@/lib/utils';
import { ENoteVisibility } from '@/types/note';

import TopbarGeneric from '../shared/TopbarGeneric';

import NoteTopbarIsNotOwner from './NoteTopbarIsNotOwner';
import NoteTopbarIsOwner from './NoteTopbarIsOwner';

import type { TNote, TEditableNote } from '@/types/note';
import type { TUser, TAuthenticatedUser } from '@/types/user';
import type { Dispatch, SetStateAction } from 'react';

type NoteDetailTopbarProps = {
  owner?: TUser | TAuthenticatedUser;
  isOwner: boolean;
  originalNote: TNote;
  editableNote: TEditableNote;
  setEditableNote: Dispatch<SetStateAction<TEditableNote>>;
};

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

export default function NoteDetailTopbar({
  owner,
  isOwner,
  originalNote,
  editableNote,
  setEditableNote
}: NoteDetailTopbarProps): JSX.Element {
  return (
    <TopbarGeneric align='between'>
      <p className='text-darker'>
        By: {owner?.username}
        {isOwner && <span className='ml-1 text-secondary'>(You)</span>}
      </p>
      <div className='flex flex-row items-center space-x-2'>
        {isOwner && (
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
                      setEditableNote((prev: TEditableNote) => {
                        return {
                          ...(prev as Pick<
                            TNote,
                            | 'title'
                            | 'category'
                            | 'tags'
                            | 'body'
                            | 'visibility'
                          >),
                          visibility
                        } as TEditableNote;
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
        )}
        <Popover className='relative'>
          <Popover.Button className='group flex flex-row items-center focus:outline-none space-x-1'>
            <AiOutlineInfoCircle className='w-5 h-5 fill-secondary group-hover:fill-darker' />
            <p className='text-secondary group-hover:text-darker'>Details</p>
          </Popover.Button>
          <Popover.Panel
            className={clsx(
              'w-72 mt-3 p-4 bg-white rounded shadow shadow-primary/50 right-0 left-1/2 z-10 -translate-x-1/2 transform absolute'
            )}
          >
            {originalNote && (
              <>
                <h3 className='font-bold text-xl mb-1'>Details</h3>
                <p className='text-darker'>
                  Author: {owner?.username}
                  {isOwner && (
                    <span className='ml-1 text-secondary'>(You)</span>
                  )}
                </p>
                <p className='text-darker'>
                  Category:{' '}
                  {originalNote?.category || (
                    <span className='text-secondary'>None</span>
                  )}
                </p>
                <p className='text-darker'>
                  Tags:{' '}
                  {convertTagsListToString(originalNote?.tags) || (
                    <span className='text-secondary'>None</span>
                  )}
                </p>
                <p className='text-darker'>
                  Visibility: {originalNote?.visibility}
                </p>
                <p className='text-darker'>
                  Date Created: {formatDate(originalNote?.createdAt)}
                </p>
                <p className='text-darker'>
                  Last Modified: {formatDate(originalNote?.lastModified)}
                </p>
              </>
            )}
          </Popover.Panel>
        </Popover>
        {isOwner ? (
          <NoteTopbarIsOwner note={originalNote} />
        ) : (
          <NoteTopbarIsNotOwner note={originalNote} />
        )}
      </div>
    </TopbarGeneric>
  );
}
