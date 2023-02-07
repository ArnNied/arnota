import { clsx } from 'clsx';

import type { IconType } from 'react-icons';

type TiptapExtensionButtonProps = {
  Icon: IconType;
  isActive?: boolean;
  onClickHandler: () => boolean | undefined;
};

export default function TiptapExtensionButton({
  Icon,
  isActive,
  onClickHandler
}: TiptapExtensionButtonProps): JSX.Element {
  return (
    <button
      type='button'
      onClick={onClickHandler}
      className='p-2 hover:bg-secondary/50 rounded active:bg-secondary'
    >
      <Icon
        className={clsx({
          'fill-primary': isActive,
          'fill-darker': !isActive
        })}
      />
    </button>
  );
}
