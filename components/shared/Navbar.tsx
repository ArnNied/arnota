import Link from 'next/link';

import NavbarLink from './NavbarLink';

type Category = {
  slug: string;
  name: string;
};

export default function Navbar(): JSX.Element {
  const categories: Category[] = [
    {
      slug: 'recipe',
      name: 'Recipe'
    },
    {
      slug: 'class-notes',
      name: 'Class Notes'
    },
    {
      slug: 'shopping-list',
      name: 'Shopping List'
    },
    {
      slug: 'todo-list',
      name: 'Todo List'
    },
    {
      slug: 'travel',
      name: 'Travel'
    },
    {
      slug: 'work',
      name: 'Work'
    },
    {
      slug: 'other',
      name: 'Other'
    }
  ];
  return (
    <nav className='w-1/5 flex flex-col h-screen bg-primary fixed'>
      <Link href='/'>
        <h1 className='w-full py-4 font-bold font-nunito text-4xl text-light text-center'>
          ARNOTA
        </h1>
      </Link>
      <div className='mx-4'>
        <NavbarLink href='/browse' text='Browse' />
        <NavbarLink href='/create' text='New Note' />
        <NavbarLink href='/home' text='Home' />
      </div>
      <div className='my-4 mx-4 overflow-y-auto'>
        {categories.map((category) => (
          <NavbarLink
            key={category.slug}
            href={`/categories/${category.slug}`}
            text={category.name}
          />
        ))}
      </div>
      <div className='mt-auto mb-4 mx-4 pt-4 border-t space-y-1'>
        <NavbarLink href='/home' text='Home' />
        <NavbarLink href='/profile' text='Profile' />
        <NavbarLink href='/settings' text='Settings' />
        <button className='w-full py-0.5 px-2 hover:bg-secondary text-light text-right rounded inline-block'>
          Logout
        </button>
      </div>
    </nav>
  );
}
