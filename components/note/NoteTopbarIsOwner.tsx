import { clsx } from 'clsx';

import TopbarGeneric from '../shared/TopbarGeneric';

import NoteTopbarButtonDelete from './NoteTopbarButtonDelete';
import NoteTopbarButtonDetails from './NoteTopbarButtonDetails';
import NoteTopbarButtonVisibility from './NoteTopbarButtonVisibility';

import type { TNote, TEditableNote } from '@/types/note';
import type { Dispatch, SetStateAction } from 'react';

type NoteTopbarIsOwnerProps = {
  status: {
    type: 'normal' | 'error';
    message: string;
  };
  isOwner: boolean;
  originalNote?: TNote;
  editableNote: TEditableNote;
  setEditableNote: Dispatch<SetStateAction<TEditableNote>>;
};

export default function NoteTopbarIsOwner({
  status,
  isOwner,
  originalNote,
  editableNote,
  setEditableNote
}: NoteTopbarIsOwnerProps): JSX.Element {
  return (
    <TopbarGeneric align='between'>
      <p
        className={clsx('text-darker', {
          'text-red-500': status.type === 'error',
          'text-darker': status.type === 'normal'
        })}
      >
        {status.message}
      </p>
      <div className='flex flex-row items-center space-x-2'>
        <NoteTopbarButtonVisibility
          editableNote={editableNote}
          setEditableNote={setEditableNote}
        />
        <NoteTopbarButtonDetails
          originalNote={originalNote}
          isOwner={isOwner}
        />
        <NoteTopbarButtonDelete noteId={originalNote?.id ?? ''} />
      </div>
    </TopbarGeneric>
  );
}
