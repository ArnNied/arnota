import { clsx } from 'clsx';
import Link from 'next/link';

type LandingNavbarButtonProps = {
  href: string;
  text: string;
  isOnTop: boolean;
};

export default function LandingNavbarButton({
  href,
  text,
  isOnTop
}: LandingNavbarButtonProps): JSX.Element {
  return (
    <Link
      href={href}
      className={clsx(
        'block lg:inline-block tracking-[0.2em] transition-colors duration-75',
        {
          'text-darker hover:text-primary active:text-primary/75': isOnTop,
          'text-white hover:text-gray-300 active:text-gray-400': !isOnTop
        }
      )}
    >
      {text}
    </Link>
  );
}
