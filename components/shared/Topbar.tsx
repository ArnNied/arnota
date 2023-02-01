type TTopbarProps = {
  author: string;
};

export default function Topbar({ author }: TTopbarProps): JSX.Element {
  return (
    <div className='w-[inherit] flex flex-row px-4 py-2 bg-light text-darker fixed'>
      <div className='flex flex-row grow justify-start'>By: {author}</div>
      <div className='flex flex-row space-x-4'>
        <button className='text-secondary hover:text-darker'>Like</button>
        <button className='text-secondary hover:text-darker'>Share</button>
        <button className='text-secondary hover:text-darker'>Copy</button>
      </div>
    </div>
  );
}
