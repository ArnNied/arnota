import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import MainLayout from '@/components/layouts/MainLayout';
import AuthRequiredMixin from '@/components/mixin/AuthRequiredMixin';
import NoteList from '@/components/note/NoteList';
import SearchField from '@/components/shared/SearchField';
import { useInitializeState } from '@/lib/hooks';

import type { TNoteWithId } from '@/types/note';
import type { NextPage } from 'next';

const CategoryPage: NextPage = () => {
  const router = useRouter();

  const { category } = router.query;

  const { authUser, personalNotesSelector } = useInitializeState();

  const [search, setSearch] = useState<string>('');
  const [filteredNotes, setFilteredNotes] = useState<TNoteWithId[]>([]);

  useEffect(() => {
    const filteredByCategory = personalNotesSelector.notes.filter(
      (note) => note.category === (category as string).split('-').join(' ')
    );
    if (search === '') {
      setFilteredNotes(filteredByCategory);
    } else {
      const alsoFilteredBySearch = filteredByCategory.filter((note) => {
        return (
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.plainBody.toLowerCase().includes(search.toLowerCase()) ||
          note.category.toLowerCase().includes(search.toLowerCase()) ||
          note.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
        );
      });

      setFilteredNotes(alsoFilteredBySearch);
    }
  }, [personalNotesSelector, category, search]);

  return (
    <AuthRequiredMixin authUser={authUser} router={router}>
      <MainLayout
        navbarCategories={personalNotesSelector.categories}
        fillScreen={filteredNotes.length === 0}
      >
        <div className='h-full px-4 py-4'>
          <div className='pb-4 border-b border-secondary'>
            <SearchField
              value={search}
              onChangeHandler={(e): void => setSearch(e.target.value)}
            />
          </div>
          <NoteList notes={filteredNotes} />
        </div>
      </MainLayout>
    </AuthRequiredMixin>
  );
};

export default CategoryPage;
