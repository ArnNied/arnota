import TopbarGeneric from '../shared/TopbarGeneric';

import NoteTopbarButtonDetails from './NoteTopbarButtonDetails';
import NoteTopbarButtonDuplicate from './NoteTopbarButtonDuplicate';
import NoteTopbarButtonFavorite from './NoteTopbarButtonFavorite';
import NoteTopbarButtonShare from './NoteTopbarButtonShare';

import type { TNote } from '@/types/note';
import type { TAuthenticatedUser, TUser } from '@/types/user';

type NoteTopbarIsNotOwnerProps = {
  owner?: TUser | TAuthenticatedUser;
  isOwner: boolean;
  originalNote?: TNote;
};

export default function NoteTopbarIsNotOwner({
  owner,
  isOwner,
  originalNote
}: NoteTopbarIsNotOwnerProps): JSX.Element {
  return (
    <TopbarGeneric align='between'>
      <p className='text-darker'>By: {owner?.username}</p>
      <div className='flex flex-row items-center space-x-2'>
        <NoteTopbarButtonDetails
          originalNote={originalNote}
          isOwner={isOwner}
        />
        <NoteTopbarButtonFavorite note={originalNote} />
        <NoteTopbarButtonShare />
        <NoteTopbarButtonDuplicate note={originalNote} />
      </div>
    </TopbarGeneric>
  );
}
