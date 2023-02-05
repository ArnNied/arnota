import { useRouter } from 'next/router';
import { useEffect } from 'react';

import NoteList from '@/components/note/NoteList';
import Navbar from '@/components/shared/Navbar';
import { setNotesIfReduxStateIsEmpty } from '@/core/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type { NextPage } from 'next';

const CategoryPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { category } = router.query;

  const notesSelector = useAppSelector((state) =>
    state.notes.filter(
      (note) => note.category === (category as string)?.split('-').join(' ')
    )
  );
  const notesCategorySelector = useAppSelector((state) => state.notesCategory);

  useEffect(() => {
    if (notesSelector.length !== 0) return;

    setNotesIfReduxStateIsEmpty(dispatch);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar categories={notesCategorySelector} />
      <div className='w-4/5 flex flex-col ml-auto pb-12 bg-light'>
        <div className='h-full px-4 py-4'>
          <div className='pb-4 border-b border-secondary'>
            <input
              type='text'
              placeholder='Search'
              className='px-2 py-1 rounded focus:outline-secondary focus:outline-none'
            />
          </div>
          <NoteList notes={notesSelector} />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
