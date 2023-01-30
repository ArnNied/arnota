import { useEffect } from 'react';

import NoteList from '@/components/note/NoteList';
import Navbar from '@/components/shared/Navbar';
import Topbar from '@/components/shared/Topbar';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setNotesIfReduxStateIsEmpty } from '@/core/utils';

export default function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const notesSelector = useAppSelector((state) => state.notes);

  useEffect(() => {
    if (notesSelector.length !== 0) return;

    setNotesIfReduxStateIsEmpty(dispatch);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Navbar />
      <div className='w-4/5 flex flex-col ml-auto pb-12 bg-light'>
        <Topbar />
        <div className='h-full px-4 py-4 mt-12'>
          <div>
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
}
