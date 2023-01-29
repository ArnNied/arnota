import TopBarNavButton from './TopBarNavButton';

export default function TopBar(): JSX.Element {
  return (
    <div className='w-full flex flex-row px-4 py-2 bg-light fixed'>
      <div className='flex flex-row grow justify-start'>
        <TopBarNavButton text='&lt;' />
        <TopBarNavButton text='&gt;' />
      </div>
    </div>
  );
}
