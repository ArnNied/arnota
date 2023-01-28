import Navbar from '@/components/shared/Navbar';

export default function MainPage(): JSX.Element {
  return (
    <>
      <Navbar />
      <div className='w-4/5 ml-auto bg-primary'>
        <h1>Main</h1>
      </div>
    </>
  );
}
