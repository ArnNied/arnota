import { clsx } from 'clsx';

import type { IconType } from 'react-icons';

type TiptapExtensionButtonProps = {
  Icon: IconType;
  textBefore?: string;
  textAfter?: string;
  isActive?: boolean;
  onClickHandler: () => boolean | undefined;
};

export default function TiptapExtensionButton({
  Icon,
  textBefore,
  textAfter,
  isActive,
  onClickHandler
}: TiptapExtensionButtonProps): JSX.Element {
  return (
    <button
      type='button'
      onClick={onClickHandler}
      className='flex flex-row items-center p-2 hover:bg-secondary/50 rounded active:bg-secondary'
    >
      {textBefore && (
        <span
          className={clsx({
            'text-primary': isActive,
            'text-darker': !isActive
          })}
        >
          {textBefore}
        </span>
      )}
      <Icon
        className={clsx({
          'fill-primary': isActive,
          'fill-darker': !isActive
        })}
      />
      {textAfter && (
        <span
          className={clsx({
            'text-primary': isActive,
            'text-darker': !isActive
          })}
        >
          {textAfter}
        </span>
      )}
    </button>
  );
}
