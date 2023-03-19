import { clsx } from 'clsx';

type TopbarProps = {
  children: JSX.Element | JSX.Element[];
  align: 'left' | 'between' | 'right';
};

export default function TopbarGeneric({
  children,
  align
}: TopbarProps): JSX.Element {
  return (
    <div
      className={clsx(
        'w-[inherit] h-12 flex flex-row items-center px-4 py-2 bg-light text-darker border-b border-secondary/50 shadow fixed z-20',
        {
          'justify-start': align === 'left',
          'justify-between': align === 'between',
          'justify-end': align === 'right'
        }
      )}
    >
      {children}
    </div>
  );
}
