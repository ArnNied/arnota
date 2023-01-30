import Link from 'next/link';
import slugify from 'slugify';

import { useAppSelector } from '@/store/hooks';

import NavbarLink from './NavbarLink';

export default function Navbar(): JSX.Element {
  const categoriesSelector = useAppSelector((state) => state.notesCategory);

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
        <div className='my-4 overflow-y-auto'>
          {categoriesSelector.map((category) => (
            <NavbarLink
              key={category}
              href={`/category/${slugify(category, { lower: true })}`}
              text={category}
            />
          ))}
        </div>
        <div className='mt-auto mb-4 pt-4 border-t space-y-1'>
          <NavbarLink href='/profile' text='Profile' />
          <NavbarLink href='/settings' text='Settings' />
          <button className='w-full py-0.5 px-2 hover:bg-secondary text-light text-right rounded inline-block'>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
