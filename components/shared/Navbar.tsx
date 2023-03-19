import 'simplebar-react/dist/simplebar.min.css';

import { generateJSON } from '@tiptap/core';
import { signOut } from 'firebase/auth';
import { addDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SimpleBar from 'simplebar-react';
import slugify from 'slugify';

import { useInitializeState } from '@/lib/context/AuthContextProvider';
import { auth } from '@/lib/firebase/core';
import { notesCollection } from '@/lib/firebase/firestore';
import { configuredExtension } from '@/lib/tiptap';
import { simplifyNoteData } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { clearAuthenticatedUser } from '@/store/slices/authenticatedUserSlice';
import { clearFavorites } from '@/store/slices/favoritedNotesSlice';
import {
  addPersonalNote,
  clearPersonalNotes
} from '@/store/slices/personalNotesSlice';
import { ENoteVisibility } from '@/types/note';

import NavbarButton from './NavbarButton';

import type { TNote } from '@/types/note';
import type { WithFieldValue } from 'firebase/firestore';

export default function Navbar(): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { authUser, personalNotesSelector } = useInitializeState();

  async function handleLogout(): Promise<void> {
    try {
      await signOut(auth);

      dispatch(clearFavorites());
      dispatch(clearPersonalNotes());
      dispatch(clearAuthenticatedUser());

      await router.push('/');
    } catch (error) {
      console.log('Failed to log out', error);
    }
  }

  async function handleCreate(): Promise<void> {
    if (!authUser) {
      console.log('User is not authenticated');

      await router.push('/login');
      return;
    }

    try {
      const newNoteDocRef = await addDoc(notesCollection, {
        title: 'Untitled',
        category: '',
        tags: [],
        body: JSON.stringify(generateJSON('', configuredExtension)),
        plainBody: '',
        owner: authUser?.uid,
        visibility: ENoteVisibility.PRIVATE,
        favoritedBy: [],
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp()
      } as WithFieldValue<Omit<TNote, 'id'>>);

      if (newNoteDocRef.id) {
        const newNoteDocSnap = await getDoc(newNoteDocRef);

        if (newNoteDocSnap.exists()) {
          const newNoteDocData = simplifyNoteData(
            newNoteDocSnap.data() as TNote
          );
          dispatch(addPersonalNote(newNoteDocData));

          await router.push(`/nota/${newNoteDocRef.id}`);
        } else {
          throw new Error('Failed to create new note');
        }
      }
    } catch (error) {
      console.log('Failed to create new note', error);
    }
  }

  return (
    <nav className='w-1/5 h-screen flex flex-col bg-primary fixed'>
      <Link href='/'>
        <h1 className='w-full py-4 font-bold text-4xl text-light text-center'>
          ARNOTA
        </h1>
      </Link>
      <div className='h-full min-h-0 flex flex-col mx-4'>
        <div className=''>
          <NavbarButton text='Home' href='/' />
          <NavbarButton text='New Note' onClickHandler={handleCreate} />
          <NavbarButton text='Browse' href='/browse' />
          <NavbarButton text='Favorites' href='/favorites' />
        </div>
        {personalNotesSelector.categories.length !== 0 && (
          <div className='h-full min-h-0 my-4'>
            <SimpleBar className='h-full'>
              {personalNotesSelector.categories.map((category) => (
                <NavbarButton
                  key={category}
                  href={`/category/${slugify(category)}`}
                  text={category}
                />
              ))}
            </SimpleBar>
          </div>
        )}
        <div className='mt-auto mb-4 pt-4 border-t space-y-1'>
          <NavbarButton href='/profile' text='Profile' />
          <NavbarButton href='/settings' text='Settings' />
          <NavbarButton onClickHandler={handleLogout} text='Logout' />
        </div>
      </div>
    </nav>
  );
}
