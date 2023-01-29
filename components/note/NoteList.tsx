import { LoremIpsum } from 'lorem-ipsum';
import { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import NoteCard from './NoteCard';
type Notes = {
  id: number;
  title: string;
  body: string;
};

export default function NoteList(): JSX.Element {
  const [notes, setNotes] = useState<Notes[]>([]);

  useEffect(() => {
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4
      },
      wordsPerSentence: {
        max: 16,
        min: 4
      }
    });
    const temp: Notes[] = [];
    for (let i = 0; i < 20; i++)
      temp.push({
        id: i,
        title: lorem.generateWords(4),
        body: lorem.generateSentences(Math.floor(Math.random() * 5))
      });

    setNotes(temp);
  }, []);
  return (
    <Masonry columnsCount={3} className='mt-4' gutter='1rem'>
      {notes.map((note, index) => (
        <div key={index} className=''>
          <NoteCard
            title={`${note.id.toString()} | ${note.title}`}
            body={note.body}
          />
        </div>
      ))}
    </Masonry>
  );
}
