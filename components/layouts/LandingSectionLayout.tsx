import { clsx } from 'clsx';

type LandingSectionLayoutProps = {
  children: JSX.Element | JSX.Element[];
  id: string;
  additionalClassName?: string;
};

export default function LandingSectionLayout({
  children,
  id,
  additionalClassName
}: LandingSectionLayoutProps): JSX.Element {
  return (
    <section id={id} className={clsx('px-32 py-12', additionalClassName)}>
      {children}
    </section>
  );
}
