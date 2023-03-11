import Link from 'next/link';

type NavbarButtonProps = {
  text?: string;
  href?: string;
  onClickHandler?: () => void;
  children?: React.ReactNode;
};

export default function NavbarButton({
  text,
  href,
  onClickHandler,
  children
}: NavbarButtonProps): JSX.Element {
  if (!href && !onClickHandler) {
    throw new Error(
      'SharedNavbarButton must have either href or onClickHandler'
    );
  } else if (href && onClickHandler) {
    throw new Error(
      'href and onClickHandler on SharedNavbarButton are mutually exclusive'
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className='w-full py-0.5 px-2 hover:bg-secondary/70 text-light text-right rounded inline-block break-words'
      >
        {text ?? children}
      </Link>
    );
  } else {
    return (
      <button
        onClick={onClickHandler}
        className='w-full py-0.5 px-2 hover:bg-secondary/70 text-light text-right rounded inline-block break-words'
      >
        {text ?? children}
      </button>
    );
  }
}
