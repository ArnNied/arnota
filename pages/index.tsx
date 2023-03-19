import { useEffect, useState } from 'react';

import FeatureSection from '@/components/landing/FeatureSection';
import HeroSection from '@/components/landing/HeroSection';
import LandingNavbar from '@/components/landing/LandingNavbar';
import WhySection from '@/components/landing/WhySection';
import MainLayout from '@/components/layouts/MainLayout';
import NoteList from '@/components/note/NoteList';
import SearchField from '@/components/shared/SearchField';
import { useInitializeState } from '@/lib/context/AuthContextProvider';

import type { TNote } from '@/types/note';
import type { NextPage } from 'next';

const IndexPage: NextPage = () => {
  const { authUser, personalNotesSelector } = useInitializeState();

  const [search, setSearch] = useState<string>('');
  const [filteredNotes, setFilteredNotes] = useState<TNote[]>([]);

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
        <MainLayout fillScreen={personalNotesSelector.notes.length === 0}>
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
        <>
          <LandingNavbar />
          <main>
            <HeroSection />
            <WhySection />
            <FeatureSection />
          </main>
        </>
      )}
    </>
  );
};

export default IndexPage;
