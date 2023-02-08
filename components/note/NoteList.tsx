import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import NoteCard from './NoteCard';

import type { TNoteWithId } from '@/types/note';

type NoteListProps = {
  notes: TNoteWithId[];
};

export default function NoteList({ notes }: NoteListProps): JSX.Element {
  return (
    <Masonry columnsCount={3} className='mt-4' gutter='1rem'>
      {notes.map((note, index) => (
        <div key={index} className=''>
          <NoteCard
            href={note.id}
            title={`${note.id} | ${note.title}`}
            body={note.body}
          />
        </div>
      ))}
    </Masonry>
  );
}
