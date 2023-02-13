import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import MainLayout from '@/components/layouts/MainLayout';
import NoteList from '@/components/note/NoteList';
import { auth } from '@/lib/firebase/core';
import { isLoggedIn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type { TNoteWithId } from '@/types/note';
import type { NextPage } from 'next';

const CategoryPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { category } = router.query;

  const [user, loading, error] = useAuthState(auth);

  const personalNotesSelector = useAppSelector((state) => state.personalNotes);
  const [filteredNotes, setFilteredNotes] = useState<TNoteWithId[]>([]);

  useEffect(() => {
    if (loading) return;

    if (error) {
      console.log('Error getting authenticated user', error);
    } else if (user && personalNotesSelector.hasBeenFetched === false) {
      isLoggedIn(user, dispatch).catch((err) => {
        console.log('Error initializing state', err);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, error, personalNotesSelector]);

  useEffect(() => {
    setFilteredNotes(
      personalNotesSelector.notes.filter(
        (note) => note.category === (category as string).split('-').join(' ')
      )
    );
  }, [personalNotesSelector, category]);

  return (
    <MainLayout navbarCategories={personalNotesSelector.categories}>
      <div className='h-full px-4 py-4'>
        <div className='pb-4 border-b border-secondary'>
          <input
            type='text'
            placeholder='Search'
            className='px-2 py-1 rounded focus:outline-secondary focus:outline-none'
          />
        </div>
        <NoteList notes={filteredNotes} />
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
