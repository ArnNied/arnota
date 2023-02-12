import type { TAuthenticatedUser, TUser } from '@/types/user';

type TopbarProps = {
  owner: TUser | TAuthenticatedUser;
  isOwner: boolean;
};

export default function Topbar({ owner, isOwner }: TopbarProps): JSX.Element {
  return (
    <div className='w-[inherit] flex flex-row px-4 py-2 bg-light text-darker fixed'>
      <div className='flex flex-row grow justify-start'>
        By: {owner?.username}{' '}
        {isOwner && <span className='ml-1 text-secondary'>(You)</span>}
      </div>
      <div className='flex flex-row space-x-4'>
        {isOwner && (
          <>
            <button className='text-secondary hover:text-darker'>Edit</button>
            <button className='text-secondary hover:text-darker'>Delete</button>
          </>
        )}
        {!isOwner && (
          <>
            <button className='text-secondary hover:text-darker'>Like</button>
            <button className='text-secondary hover:text-darker'>Share</button>
            <button className='text-secondary hover:text-darker'>Copy</button>
          </>
        )}
      </div>
    </div>
  );
}
