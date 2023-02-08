import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import MainLayout from '@/components/layouts/MainLayout';
import NoteList from '@/components/note/NoteList';
import { auth } from '@/lib/firebase/core';
import { setNotesIfReduxStateIsEmpty } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type { NextPage } from 'next';

const IndexPage: NextPage = () => {
  const dispatch = useAppDispatch();

  const [user, loading, error] = useAuthState(auth);

  const personalNotesSelector = useAppSelector((state) => state.personalNotes);

  useEffect(() => {
    if (loading) return;
    if (error) console.log('Error in IndexPage useEffect', error);
    else if (user && personalNotesSelector.hasBeenFetched === false)
      void setNotesIfReduxStateIsEmpty(user.uid, dispatch);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, personalNotesSelector]);

  return (
    <>
      {user && (
        <MainLayout navbarCategories={personalNotesSelector.categories}>
          <>
            <div className='h-full px-4 py-4'>
              <div className='pb-4 border-b border-secondary'>
                <input
                  type='text'
                  placeholder='Search'
                  className='px-2 py-1 rounded focus:outline-secondary focus:outline-none'
                />
              </div>
              <NoteList notes={personalNotesSelector.notes} />
            </div>
          </>
        </MainLayout>
      )}
      {!user && (
        <div className='bg-primary'>
          <h1>LandingPage</h1>
        </div>
      )}
    </>
  );
};

export default IndexPage;
