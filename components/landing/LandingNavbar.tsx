import { clsx } from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import LandingNavbarButton from './LandingNavbarButton';

export default function LandingNavbar(): JSX.Element {
  const [isOnTop, setIsOnTop] = useState(true);

  useEffect(() => {
    if (window.scrollY > 0) setIsOnTop(false);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) setIsOnTop(false);
      else setIsOnTop(true);
    });
  }, []);

  return (
    <div
      className={clsx(
        'fixed w-full flex items-center justify-between flex-wrap px-8 lg:px-32 py-6 transition z-50',
        {
          'bg-primary/80 shadow hover:shadow-lg backdrop-blur-lg': !isOnTop,
          'bg-transparent': isOnTop
        }
      )}
    >
      <div className='flex items-center flex-shrink-0'>
        <Link
          href='/'
          className={clsx('font-semibold transition-colors', {
            'text-primary text-xl': isOnTop,
            'text-light text-xl': !isOnTop
          })}
        >
          Arnota
        </Link>
      </div>
      <div className='hidden lg:flex flex-row space-x-4'>
        <LandingNavbarButton
          href='/#why'
          text='Why Use Arnota?'
          isOnTop={isOnTop}
        />
        <LandingNavbarButton
          href='/#feature'
          text='Features'
          isOnTop={isOnTop}
        />
      </div>
      <div className='flex flex-row space-x-4'>
        <Link
          href='/login'
          className={clsx(
            'block lg:inline-block px-2 py-1 border-2 rounded transition-colors duration-75',
            {
              'text-darker hover:text-primary active:text-primary/75 border-primary':
                isOnTop,
              'text-white hover:text-gray-300 active:text-gray-400 border-white':
                !isOnTop
            }
          )}
        >
          Sign in
        </Link>
        <Link
          href='/register'
          className={clsx(
            'block lg:inline-block px-2 py-1 rounded transition-colors duration-75',
            {
              'text-white bg-primary hover:text-gray-300 active:text-gray-400':
                isOnTop,
              'text-darker bg-white hover:text-primary active:text-primary/75':
                !isOnTop
            }
          )}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
