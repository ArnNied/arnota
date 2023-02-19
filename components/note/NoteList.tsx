import Masonry from 'react-responsive-masonry';

import NoteCard from './NoteCard';

import type { TNoteWithId } from '@/types/note';

type NoteListProps = {
  notes: TNoteWithId[];
  noNotesMessage?: string;
  noNotesSubMessage?: string;
};

export default function NoteList({
  notes,
  noNotesMessage = 'No notes found',
  noNotesSubMessage = 'Try creating a new note'
}: NoteListProps): JSX.Element {
  return (
    <>
      {notes.length === 0 ? (
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <h1 className='text-2xl font-bold text-center text-primary'>
            {noNotesMessage}
          </h1>
          <p className='text-center text-darker'>{noNotesSubMessage}</p>
        </div>
      ) : (
        <Masonry columnsCount={3} className='mt-4' gutter='1rem'>
          {notes.map((note, index) => (
            <div key={index} className=''>
              <NoteCard note={note} />
            </div>
          ))}
        </Masonry>
      )}
    </>
  );
}
