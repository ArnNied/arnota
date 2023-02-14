import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import MainLayout from '@/components/layouts/MainLayout';
import NoteList from '@/components/note/NoteList';
import { auth } from '@/lib/firebase/core';
import { isLoggedIn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type { TNoteWithId } from '@/types/note';
import type { NextPage } from 'next';

const IndexPage: NextPage = () => {
  const dispatch = useAppDispatch();

  const [user, loading, error] = useAuthState(auth);

  const personalNotesSelector = useAppSelector((state) => state.personalNotes);

  const [search, setSearch] = useState<string>('');
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
    if (search === '') {
      setFilteredNotes(personalNotesSelector.notes);
    } else {
      const filteredBySearch = personalNotesSelector.notes.filter((note) => {
        return (
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.plainBody.toLowerCase().includes(search.toLowerCase()) ||
          note.category.toLowerCase().includes(search.toLowerCase()) ||
          note.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
        );
      });

      setFilteredNotes(filteredBySearch);
    }
  }, [search, personalNotesSelector]);

  return (
    <>
      {user && (
        <MainLayout navbarCategories={personalNotesSelector.categories}>
          <div className='h-full px-4 py-4'>
            <div className='pb-4 border-b border-secondary'>
              <input
                type='text'
                placeholder='Search'
                className='px-2 py-1 rounded focus:outline-secondary focus:outline-none'
                value={search}
                onChange={(e): void => setSearch(e.target.value)}
              />
            </div>
            <NoteList
              notes={filteredNotes}
              noNotesMessage="You don't have any notes"
              noNotesSubMessage='Start writing down your ideas and thoughts'
            />
          </div>
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
