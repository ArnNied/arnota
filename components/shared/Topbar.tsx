import TopbarNavButton from './TopbarNavButton';

export default function Topbar(): JSX.Element {
  return (
    <div className='w-full flex flex-row px-4 py-2 bg-light fixed'>
      <div className='flex flex-row grow justify-start'>
        <TopbarNavButton text='&lt;' />
        <TopbarNavButton text='&gt;' />
      </div>
    </div>
  );
}
