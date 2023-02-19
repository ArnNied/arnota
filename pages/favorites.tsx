import { getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import MainLayout from '@/components/layouts/MainLayout';
import NoteList from '@/components/note/NoteList';
import SearchField from '@/components/shared/SearchField';
import { notesCollection } from '@/lib/firebase/firestore';
import { useInitializeState } from '@/lib/hooks';
import { useAppSelector } from '@/store/hooks';

import type { TNoteWithId } from '@/types/note';
import type { NextPage } from 'next';

const FavoritesPage: NextPage = () => {
  const { authUser, personalNotesSelector } = useInitializeState();

  const favoritedNotesSelector = useAppSelector(
    (state) => state.favoritedNotes
  );

  const [search, setSearch] = useState<string>('');
  const [filteredNotes, setFilteredNotes] = useState<TNoteWithId[]>([]);

  useEffect(() => {
    if (!authUser) return;

    if (favoritedNotesSelector.hasBeenFetched === false) {
      const q = query(
        notesCollection,
        where('favoritedBy', 'array-contains', authUser?.uid)
      );
      getDocs(q)
        .then((querySnapshot) => {
          const notes: TNoteWithId[] = [];
          querySnapshot.forEach((doc) => {
            const note = doc.data() as TNoteWithId;
            note.id = doc.id;
            notes.push(note);
          });

          setFilteredNotes(notes);
        })
        .catch((error) => {
          console.log('Error getting documents: ', error);
        });
    }
  }, [authUser, favoritedNotesSelector.hasBeenFetched]);

  useEffect(() => {
    if (search === '') {
      setFilteredNotes(favoritedNotesSelector.notes);
    } else {
      const filteredBySearch = favoritedNotesSelector.notes.filter((note) => {
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
  }, [search, favoritedNotesSelector]);

  return (
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
  );
};

export default FavoritesPage;
