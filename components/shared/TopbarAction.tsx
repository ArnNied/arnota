import Link from 'next/link';

import type { IconType } from 'react-icons';

const containerClassname = 'flex items-center space-x-1 group';
const textClassName = 'text-darker/50 group-hover:text-darker';
const iconSize = '1.25em';

type TopbarActionProps = {
  Icon: IconType;
  iconClassName: string;
  text: string;
  href?: string;
  onClickHandler?: () => void;
};

export default function TopbarAction({
  Icon,
  iconClassName,
  text,
  href,
  onClickHandler
}: TopbarActionProps): JSX.Element {
  if (!href && !onClickHandler) {
    throw new Error('TopbarAction must have either href or onClickHandler');
  } else if (href && onClickHandler) {
    throw new Error(
      'href and onClickHandler on TopbarAction are mutually exclusive'
    );
  }

  if (href) {
    return (
      <Link href={href} className={containerClassname}>
        <Icon size={iconSize} className={iconClassName} />
        <p className={textClassName}>{text}</p>
      </Link>
    );
  } else {
    return (
      <button onClick={onClickHandler} className={containerClassname}>
        <Icon size={iconSize} className={iconClassName} />
        <p className={textClassName}>{text}</p>
      </button>
    );
  }
}
