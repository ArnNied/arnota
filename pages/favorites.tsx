import { getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import MainLayout from '@/components/layouts/MainLayout';
import AuthRequiredMixin from '@/components/mixin/AuthRequiredMixin';
import NoteList from '@/components/note/NoteList';
import SearchField from '@/components/shared/SearchField';
import { useInitializeState } from '@/lib/context/AuthContextProvider';
import { notesCollection } from '@/lib/firebase/firestore';
import { simplifyNoteData } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFavorites } from '@/store/slices/favoritedNotesSlice';
import { ENoteVisibility } from '@/types/note';

import type { TNote } from '@/types/note';
import type { NextPage } from 'next';

const FavoritesPage: NextPage = () => {
  const dispatch = useAppDispatch();

  const { authUser } = useInitializeState();

  const favoritedNotesSelector = useAppSelector(
    (state) => state.favoritedNotes
  );

  const [search, setSearch] = useState<string>('');
  const [filteredNotes, setFilteredNotes] = useState<TNote[]>([]);

  useEffect(() => {
    if (!authUser) return;

    if (favoritedNotesSelector.hasBeenFetched === false) {
      const q = query(
        notesCollection,
        where('visibility', '!=', ENoteVisibility.PRIVATE),
        where('favoritedBy', 'array-contains', authUser?.uid)
      );

      void (async (): Promise<void> => {
        try {
          const querySnapshot = await getDocs(q);
          const notes: TNote[] = [];
          querySnapshot.forEach((noteDoc) => {
            const noteDocData = simplifyNoteData(noteDoc.data());
            noteDocData.id = noteDoc.id;
            notes.push(noteDocData);
          });

          setFilteredNotes(notes);
          dispatch(setFavorites(notes));
        } catch (err) {
          console.log('Error getting documents: ', err);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <AuthRequiredMixin>
      <MainLayout fillScreen={favoritedNotesSelector.notes.length === 0}>
        <div className='h-full px-4 py-4'>
          <div className='pb-4 border-b border-secondary'>
            <SearchField
              value={search}
              onChangeHandler={(e): void => setSearch(e.target.value)}
            />
          </div>
          <NoteList
            notes={filteredNotes}
            noNotesMessage="You don't have any favorite notes yet"
            noNotesSubMessage='Any note you favorite will show up here'
          />
        </div>
      </MainLayout>
    </AuthRequiredMixin>
  );
};

export default FavoritesPage;
