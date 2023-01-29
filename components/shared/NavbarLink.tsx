import Link from 'next/link';

type NavbarLinkProps = {
  href: string;
  text?: string;
  children?: React.ReactNode;
};

export default function NavbarLink({
  href,
  text,
  children
}: NavbarLinkProps): JSX.Element {
  return (
    <Link
      href={href}
      className='w-full py-0.5 px-2 hover:bg-secondary/70 text-light text-right rounded inline-block'
    >
      {text ?? children}
    </Link>
  );
}
