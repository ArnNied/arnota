import NoteList from '@/components/note/NoteList';
import Navbar from '@/components/shared/Navbar';
import TopBar from '@/components/shared/TopBar';

export default function MainPage(): JSX.Element {
  return (
    <>
      <Navbar />
      <div className='w-4/5 flex flex-col ml-auto pb-12 bg-light'>
        <TopBar />
        <div className='h-full px-4 py-4 mt-12'>
          <div>
            <input
              type='text'
              placeholder='Search'
              className='px-2 py-1 rounded focus:outline-secondary focus:outline-none'
            />
          </div>
          <NoteList />
        </div>
      </div>
    </>
  );
}
