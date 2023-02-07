import Navbar from '../shared/Navbar';

type MainLayoutProps = {
  children: JSX.Element | JSX.Element[];
  navbarCategories?: string[];
};

export default function MainLayout({
  children,
  navbarCategories
}: MainLayoutProps): JSX.Element {
  return (
    <>
      <Navbar categories={navbarCategories} />
      <main className='w-4/5 flex flex-col ml-auto pb-12 bg-light'>
        {children}
      </main>
    </>
  );
}
