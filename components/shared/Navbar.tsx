import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSignOut } from 'react-firebase-hooks/auth';
import slugify from 'slugify';

import { auth } from '@/lib/firebase/core';
import { useAppDispatch } from '@/store/hooks';
import { clearAuthenticatedUser } from '@/store/slices/authenticatedUserSlice';

import NavbarLink from './NavbarLink';

type NavbarProps = {
  categories?: string[];
};

export default function Navbar({ categories }: NavbarProps): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [signOut, , error] = useSignOut(auth);

  async function handleLogout(): Promise<void> {
    const success = await signOut();

    if (success) {
      dispatch(clearAuthenticatedUser());

      await router.push('/');
    } else {
      console.log('Failed to log out', error);
    }
  }

  return (
    <nav className='w-1/5 flex flex-col h-screen bg-primary fixed'>
      <Link href='/'>
        <h1 className='w-full py-4 font-bold text-4xl text-light text-center'>
          ARNOTA
        </h1>
      </Link>
      <div className='grow flex flex-col mx-4'>
        <div>
          <NavbarLink href='/' text='Home' />
          <NavbarLink href='/create' text='New Note' />
          <NavbarLink href='/browse' text='Browse' />
          <NavbarLink href='/favorites' text='Favorites' />
        </div>
        {categories && categories.length !== 0 && (
          <div className='my-4 overflow-y-auto'>
            {categories.map((category) => (
              <NavbarLink
                key={category}
                href={`/category/${slugify(category)}`}
                text={category}
              />
            ))}
          </div>
        )}
        <div className='mt-auto mb-4 pt-4 border-t space-y-1'>
          <NavbarLink href='/profile' text='Profile' />
          <NavbarLink href='/settings' text='Settings' />
          <button
            onClick={handleLogout}
            className='w-full py-0.5 px-2 hover:bg-secondary/70 text-light text-right rounded inline-block'
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
