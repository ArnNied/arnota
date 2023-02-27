import { clsx } from 'clsx';
import Link from 'next/link';

import type { IconType } from 'react-icons';

const classNamesMap = {
  SHARED: {
    container: 'group',
    text: ''
  },
  BASE: {
    container: '',
    text: 'text-darker/50 group-hover:text-darker'
  },
  PRIMARY: {
    container: 'px-4 py-1 bg-primary rounded',
    text: 'text-white group-hover:text-gray-200'
  },
  INVERTED: {
    container: 'px-4 py-1 bg-white border-2 border-primary rounded',
    text: 'text-primary group-hover:text-primary/80'
  }
};

type SharedButtonProps = {
  text: string;
  type?: 'PRIMARY' | 'INVERTED';
  inputType?: 'button' | 'submit' | 'reset';
  Icon?: IconType;
  iconClassName?: string;
  additionalContainerClassName?: string;
  additionalTextClassName?: string;
  href?: string;
  onClickHandler?: () => void;
};

export default function SharedButton({
  text,
  type,
  inputType,
  Icon,
  iconClassName,
  additionalContainerClassName,
  additionalTextClassName,
  href,
  onClickHandler
}: SharedButtonProps): JSX.Element {
  if (inputType !== 'submit' && !href && !onClickHandler) {
    throw new Error('SharedButton must have either href or onClickHandler');
  } else if (href && inputType) {
    throw new Error(
      'href and inputType on SharedButton are mutually exclusive'
    );
  } else if (href && onClickHandler) {
    throw new Error(
      'href and onClickHandler on SharedButton are mutually exclusive'
    );
  }

  const configuredContainerClassName = clsx(
    {
      'flex flex-row items-center space-x-1': Icon
    },
    classNamesMap.SHARED.container,
    additionalContainerClassName,
    type ? classNamesMap[type].container : classNamesMap.BASE.container
  );
  const configuredTextClassName = clsx(
    classNamesMap.SHARED.text,
    additionalTextClassName,
    type ? classNamesMap[type].text : classNamesMap.BASE.text
  );
  const configuredIconClassName = clsx('w-5 h-5', iconClassName);

  if (href) {
    return (
      <Link href={href} className={configuredContainerClassName}>
        {Icon && <Icon className={configuredIconClassName} />}
        <p className={configuredTextClassName}>{text}</p>
      </Link>
    );
  } else {
    return (
      <button
        type={inputType ?? 'button'}
        onClick={onClickHandler}
        className={configuredContainerClassName}
      >
        {Icon && <Icon className={configuredIconClassName} />}
        <p className={configuredTextClassName}>{text}</p>
      </button>
    );
  }
}
