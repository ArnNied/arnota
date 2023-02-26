import { Dialog } from '@headlessui/react';

type NoteActionModalProps = {
  children: JSX.Element | JSX.Element[];
  title: string;
  description?: string;
  isOpen: boolean;
  onCloseHandler: () => void;
};

export default function NoteActionModal({
  children,
  title,
  description,
  isOpen,
  onCloseHandler
}: NoteActionModalProps): JSX.Element {
  return (
    <Dialog open={isOpen} onClose={onCloseHandler} className='relative z-50'>
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />

      {/* Full-screen container to center the panel */}
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        {/* The actual dialog panel  */}
        <Dialog.Panel className='max-w-sm p-8 bg-white rounded space-y-4 shadow-2xl'>
          <Dialog.Title className='font-bold text-2xl text-darker'>
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className='text-darker'>
              {description}
            </Dialog.Description>
          )}

          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
