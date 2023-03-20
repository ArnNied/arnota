import { useState } from 'react';
import { AiOutlineLink, AiOutlineTwitter } from 'react-icons/ai';
import { HiShare } from 'react-icons/hi';

import SharedButton from '../shared/SharedButton';

import NoteActionModal from './NoteActionModal';

export default function NoteTopbarButtonShare(): JSX.Element {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  async function handleShare(): Promise<void> {
    await navigator.clipboard.writeText(window.location.href);

    alert("Note's link copied to clipboard");
  }

  return (
    <>
      <NoteActionModal
        title='Share this note'
        isOpen={shareModalOpen}
        onCloseHandler={(): void => setShareModalOpen(false)}
      >
        <div className='w-full flex flex-row flex-wrap justify-center space-x-2'>
          <button
            type='button'
            title='Copy link to clipboard'
            className='w-12 h-12 flex items-center justify-center bg-gray-400 rounded-full'
            onClick={handleShare}
          >
            <AiOutlineLink size='1.5em' className='fill-white' />
          </button>
          <button
            type='button'
            title='Copy link to clipboard'
            className='w-12 h-12 flex items-center justify-center bg-blue-500 rounded-full'
            onClick={handleShare}
          >
            <AiOutlineTwitter size='1.5em' className='fill-white' />
          </button>
        </div>
      </NoteActionModal>

      <SharedButton
        Icon={HiShare}
        text='Share'
        iconClassName='fill-green-500/75 group-hover:fill-green-500'
        onClickHandler={(): void => setShareModalOpen(true)}
      />
    </>
  );
}
