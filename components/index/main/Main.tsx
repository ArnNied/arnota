import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import NoteList from '@/components/note/NoteList';
import Navbar from '@/components/shared/Navbar';
import { auth } from '@/core/firebase';
import { setNotesIfReduxStateIsEmpty } from '@/core/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function MainPage(): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [user, loading, error] = useAuthState(auth);

  const notesSelector = useAppSelector((state) => state.notes);
  const notesCategorySelector = useAppSelector((state) => state.notesCategory);

  useEffect(() => {
    if (error) console.log('Error in MainPage useEffect', error);
    else if (user) setNotesIfReduxStateIsEmpty(dispatch);
    else if (!loading) void router.push('/login');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);
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
}
