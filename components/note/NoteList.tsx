import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import NoteCard from './NoteCard';
import type { TNote } from '@/types/note';

type NoteListProps = {
  notes: TNote[];
};

export default function NoteList({ notes }: NoteListProps): JSX.Element {
  return (
    <Masonry columnsCount={3} className='mt-4' gutter='1rem'>
      {notes.map((note, index) => (
        <div key={index} className=''>
          <NoteCard
            href={note.id}
            title={`${note.id.toString()} | ${note.title}`}
            body={note.body}
          />
        </div>
      ))}
    </Masonry>
  );
}
