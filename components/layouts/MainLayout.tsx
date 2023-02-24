import { clsx } from 'clsx';

import Navbar from '@/components/shared/Navbar';

type MainLayoutProps = {
  children: JSX.Element | JSX.Element[];
  navbarCategories?: string[];
  fillScreen?: boolean;
};

export default function MainLayout({
  children,
  navbarCategories,
  fillScreen = false
}: MainLayoutProps): JSX.Element {
  return (
    <>
      <Navbar categories={navbarCategories} />
      <main
        className={clsx('w-4/5 flex flex-col ml-auto pb-12 bg-light', {
          'h-screen': fillScreen,
          'h-full': !fillScreen
        })}
      >
        {children}
      </main>
    </>
  );
}
