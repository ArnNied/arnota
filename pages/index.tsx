import { useEffect, useState } from 'react';

import MainLayout from '@/components/layouts/MainLayout';
import NoteList from '@/components/note/NoteList';
import SearchField from '@/components/shared/SearchField';
import { useInitializeState } from '@/lib/hooks';

import type { TNoteWithId } from '@/types/note';
import type { NextPage } from 'next';

const IndexPage: NextPage = () => {
  const { authUser, personalNotesSelector } = useInitializeState();

  const [search, setSearch] = useState<string>('');
  const [filteredNotes, setFilteredNotes] = useState<TNoteWithId[]>([]);

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
      {authUser ? (
        <MainLayout navbarCategories={personalNotesSelector.categories}>
          <div className='h-full px-4 py-4'>
            <div className='pb-4 border-b border-secondary'>
              <SearchField
                value={search}
                onChangeHandler={(e): void => setSearch(e.target.value)}
              />
            </div>
            <NoteList
              notes={filteredNotes}
              noNotesMessage="You don't have any notes"
              noNotesSubMessage='Start writing down your ideas and thoughts'
            />
          </div>
        </MainLayout>
      ) : (
        <div className='bg-primary'>
          <h1>LandingPage</h1>
        </div>
      )}
    </>
  );
};

export default IndexPage;
