import { generateHTML } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import Navbar from '@/components/shared/Navbar';
import Topbar from '@/components/shared/Topbar';
import { useAppSelector } from '@/store/hooks';

import type { TNote } from '@/types/note';
import type { JSONContent } from '@tiptap/core';
import type { NextPage } from 'next';

const NoteDetailPage: NextPage = () => {
  const router = useRouter();
  const notesSelector = useAppSelector((state) => state.notes);

  const { noteId } = router.query;

  const [note, setNote] = useState<TNote>();

  const output = useMemo(() => {
    if (!note) return null;

    try {
      const generatedHTML: string = generateHTML(
        JSON.parse(note?.body) as JSONContent,
        [StarterKit]
      );
      console.log(generatedHTML);

      const sanitized = DOMPurify.sanitize(generatedHTML);

      console.log(sanitized);

      // const sanitized;
      return generatedHTML;
    } catch (error) {
      return note.body;
    }
  }, [note]);

  useEffect(() => {
    if (!router.isReady) return;

    if (notesSelector.length === 0) {
      void router.push('/');
      return;
    }

    const currentNote = notesSelector.find((note) => note.id === noteId);

    setNote(currentNote);
    // fetch(`/api/note/${noteId}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      <Navbar />
      <div className='w-4/5 flex flex-col ml-auto pb-12 bg-light'>
        <Topbar author='(Me)' />
        <div className='h-full px-8 py-4 mt-12'>
          <h2 className='font-bold font-poppins text-4xl text-darker'>
            {note?.title}
          </h2>
          <h3 className='mt-2 font-semibold text-secondary'>
            Category: {note?.category}{' '}
          </h3>
          <p className='mt-4 font-poppins text-darker whitespace-pre-wrap'>
            {parse(output ?? '')}
          </p>
        </div>
      </div>
    </>
  );
};

export default NoteDetailPage;
