import { Popover } from '@headlessui/react';
import { clsx } from 'clsx';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import { convertTagsListToString, formatDate } from '@/lib/utils';

import type { TNote } from '@/types/note';
import type { TAuthenticatedUser, TUser } from '@/types/user';

type NoteTopbarButtonDetailsProps = {
  owner?: TUser | TAuthenticatedUser;
  isOwner: boolean;
  originalNote?: TNote;
};

export default function NoteTopbarButtonDetails({
  owner,
  isOwner,
  originalNote
}: NoteTopbarButtonDetailsProps): JSX.Element {
  return (
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
              {isOwner && <span className='ml-1 text-secondary'>(You)</span>}
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
  );
}
