type TopbarProps = {
  left?: JSX.Element | JSX.Element[];
  right?: JSX.Element | JSX.Element[];
};

export default function Topbar({ left, right }: TopbarProps): JSX.Element {
  return (
    <div className='w-[inherit] h-12 flex flex-row justify-between px-4 py-2 bg-light text-darker border-b border-secondary/50 shadow fixed'>
      <div className='flex flex-row space-x-2'>{left}</div>
      <div className='flex flex-row space-x-2'>{right}</div>
    </div>
  );
}
