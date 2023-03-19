import Link from 'next/link';

type NavbarButtonProps = {
  text?: string;
  href?: string;
  onClickHandler?: () => void;
};

const navbarButtonClassName =
  'w-full py-0.5 px-2 hover:bg-secondary/70 text-light text-right rounded inline-block break-words';
export default function NavbarButton({
  text,
  href,
  onClickHandler
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
      <Link href={href} className={navbarButtonClassName}>
        {text}
      </Link>
    );
  } else {
    return (
      <button onClick={onClickHandler} className={navbarButtonClassName}>
        {text}
      </button>
    );
  }
}
